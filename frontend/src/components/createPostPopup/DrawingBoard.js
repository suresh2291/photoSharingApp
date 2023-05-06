/**
 * The code is a React component for an Image Annotation Toolbar. It allows users to add text, circles, and freehand drawings on an image, 
   and provides features like undo, redo, download annotated image, and close the component.
 * The component uses the react-konva package for drawing the text, circles, and freehand drawings on a canvas.
 * It uses React hooks like useState, useRef, and useReducer to manage the state and handle user interactions.
 * The reducer function is used to manage the state of the elements, undo stack, and redo stack. It handles actions like adding elements, undoing, and redoing.
 * The component has several event handlers for mouse and touch events like handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart,
    handleTouchMove, and handleTouchEnd. These handlers are responsible for drawing the elements based on user interactions.
 * The component uses Bootstrap components like Container, Row, Col, Navbar, Nav, NavDropdown for the layout and UI.
 * There are several utility functions like handleDownload for downloading the annotated image and posting the image to the home page,
    handleColorChange for changing the color, handleSizeChange for changing the size, handleUndo and handleRedo for undoing and redoing actions,
    handleCloseModal for closing the component, and handleFontSelect for selecting the font.
 * The component also sets up event listeners for keyboard shortcuts like Ctrl+Z for undo and Ctrl+Y for redo.

The JSX markup is structured using Bootstrap grid system to create a responsive layout.
 */
import React, { useState, useRef, useReducer } from "react";
import { Stage, Layer, Image, Text, Circle, Line } from "react-konva";
import { uploadImages } from "../../functions/uploadImages";
import { createPost } from "../../functions/post";

import {
  Download,
  TextIcon,
  Undo,
  Redo,
  CircleIcon,
  CloseIcon,
  Pencil,
} from "../../svg";
import {
  Col,
  Container,
  Dropdown,
  Nav,
  NavDropdown,
  Navbar,
  Row,
} from "react-bootstrap";

const initialState = {
  elements: [],
  undoStack: [],
  redoStack: [],
};
function reducer(state, action) {
  switch (action.type) {
    case "ADD_ELEMENT":
      return {
        ...state,
        elements: [...state.elements, action.payload],
        undoStack: [...state.undoStack, state.elements],
        redoStack: [],
      };
    case "UNDO":
      if (state.undoStack.length === 0) {
        return state;
      }
      return {
        ...state,
        elements: state.undoStack[state.undoStack.length - 1],
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.elements],
      };
    case "REDO":
      if (state.redoStack.length === 0) {
        return state;
      }
      return {
        ...state,
        elements: state.redoStack[state.redoStack.length - 1],
        undoStack: [...state.undoStack, state.elements],
        redoStack: state.redoStack.slice(0, -1),
      };
    default:
      return state;
  }
}
export default function DrawingBoard({
  imageUrl,
  file,
  user,
  setError,
  setSelectedImageIndex,
}) {
  const [selectedTool, setSelectedTool] = useState(null);
  const [{ elements, undoStack, redoStack }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [color, setColor] = useState("#000000");
  const [image, setImage] = useState(null);
  const stageRef = useRef(null);
  const layerRef = useRef();

  const fontOptions = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Comic Sans MS",
    "Impact",
    "Tahoma",
    "Lucida Console",
    "Open Sans",
    "Montserrat",
    "Roboto",
    "Hiragino Kaku Gothic ProN",
    "Hiragino Mincho ProN",
    "Yu Gothic",
    "Meiryo UI",
    "MS PGothic",
    "MS PMincho",
  ];
  const fontSize = [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56];
  const [size, setSize] = useState(fontSize[0]);
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);

  React.useEffect(() => {
    if (imageUrl) {
      const newImage = new window.Image();
      newImage.crossOrigin = "anonymous";
      newImage.src = imageUrl;
      newImage.onload = () => {
        setImage(newImage);
      };
    }
  }, [imageUrl]);

  //This  function will download the image and at the same time post the image to home page.
  const handleDownload = () => {
    const url = layerRef.current.toCanvas();
    url.toBlob(async (blob) => {
      const path = `${user?.userName}/postImages`;
      let formData = new FormData();
      formData.append("path", path);
      formData.append("filename", file.fileName);
      formData.append("userId", user?.id);
      formData.append("images", blob);

      const response = await uploadImages(
        formData,
        path,
        user?.id,
        file,
        null,
        null,
        user?.token
      );

      if (response.length > 0) {
        const res = await createPost(
          null,
          null,
          null,
          response,
          user?.id,
          user?.token
        );

        if (res.status === "ok") {
          const link = document.createElement("a");
          link.download = `annotate_${file.fileName}`;
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          setError(res);
        }
      } else {
        setError("Error in uploading image");
      }
    });
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  const handleMouseDown = () => {
    setIsDrawing(true);
    setLines([]);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) {
      return;
    }
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setLines([...lines, point.x, point.y]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (selectedTool === "pen") {
      const newLine = (
        <Line
          points={lines}
          stroke={color}
          strokeWidth={5}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />
      );
      dispatch({ type: "ADD_ELEMENT", payload: newLine });
    }
    
  };
  const handleImageClick = (event) => {
    const stage = stageRef.current;
    let pointerPos = stage.getPointerPosition();
    if (selectedTool === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.style.position = "absolute";
      input.style.top = `${pointerPos.y}px`;
      input.style.left = `${pointerPos.x}px`;
      input.style.fontFamily = selectedFont;
      input.style.fontSize = { size };
      input.style.color = { color };
      input.style.textRendering = "optimizeLegibility";
      input.style.zIndex = "9999999999999999999";
      input.focus();
      input.addEventListener("keydown", (e) => {
        if (e.keyCode === 13 || event.key === "Enter") {
          const maxWidth = Math.min(
            pointerPos.x,
            stage.width() - pointerPos.x,
            pointerPos.y,
            stage.height() - pointerPos.y
          ) ;
          const newText = (
            <Text
              x={pointerPos.x}
              y={pointerPos.y}
              text={input.value}
              fontSize={size}
              fill={color}
              fontFamily={selectedFont}
              width={maxWidth}
              wrap="wrap"
            />
          );
          dispatch({ type: "ADD_ELEMENT", payload: newText });
          input.remove();
        }
      });
      document.body.appendChild(input);
      input.focus();
    } else if (selectedTool === "circle") {
      const newCircle = (
        <Circle
          x={pointerPos.x}
          y={pointerPos.y}
          radius={size}
          stroke={color}
          strokeWidth={5}
        />
      );
      dispatch({ type: "ADD_ELEMENT", payload: newCircle });
    }
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleSizeChange = (size) => {
    setSize(parseInt(size));
  };

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      } else if (event.ctrlKey && event.key === "y") {
        handleRedo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handleFontSelect = (font) => {
    setSelectedFont(font);
  };

  const handleTouchStart = (event) => {
    setIsDrawing(true);
    setLines([]);
  };
  
  const handleTouchMove = (event) => {
    if (!isDrawing) {
      return;
    }
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setLines([...lines, point.x, point.y]);
  };
  
  const handleTouchEnd = (event) => {
   const stage = stageRef.current;
   const pointerPos = stage.getPointerPosition();
    setIsDrawing(false);
    if (selectedTool === "pen") {
      const newLine = (
        <Line
          points={lines}
          stroke={color}
          strokeWidth={5}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />
      );
      dispatch({ type: "ADD_ELEMENT", payload: newLine });
    }else if (selectedTool === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.style.position = "absolute";
      input.style.top = `${pointerPos.y}px`;
      input.style.left = `${pointerPos.x}px`;
      input.style.fontFamily = selectedFont;
      input.style.fontSize = { size };
      input.style.color = { color };
      input.style.textRendering = "optimizeLegibility";
      input.style.zIndex = "9999999999999999999";
      input.focus();
      input.addEventListener("keydown", (e) => {
        if (e.keyCode === 13 || event.key === "Enter") {
          const maxWidth = Math.min(
            pointerPos.x,
            stage.width() - pointerPos.x,
            pointerPos.y,
            stage.height() - pointerPos.y
          ) ;
          const newText = (
            <Text
              x={pointerPos.x}
              y={pointerPos.y}
              text={input.value}
              fontSize={size}
              fill={color}
              fontFamily={selectedFont}
              width={maxWidth}
              wrap="word" // specify the wrapping mode
            />
          );
          dispatch({ type: "ADD_ELEMENT", payload: newText });
          input.remove();
        }
      });
      document.body.appendChild(input);
      input.focus();
    } else if (selectedTool === "circle") {
      const newCircle = (
        <Circle
          x={pointerPos.x}
          y={pointerPos.y}
          radius={size}
          stroke={color}
          strokeWidth={5}
        />
      );
      dispatch({ type: "ADD_ELEMENT", payload: newCircle });
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Navbar className="w-100 justify-content-center">
            <Nav>
              <Dropdown  drop="down-centered">
                <Dropdown.Toggle variant="light" style={{ color: "grey" }}>
                  {selectedFont}
                </Dropdown.Toggle>
                <Dropdown.Menu align="start">
                  {fontOptions.map((font) => (
                    <NavDropdown.Item
                      key={font}
                      onClick={() => handleFontSelect(font)}
                    >
                      {font}
                    </NavDropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown  drop="down-centered">
                <Dropdown.Toggle variant="light" style={{ color: "grey" }}>
                  {size}
                </Dropdown.Toggle>
                <Dropdown.Menu align="start">
                  {fontSize.map((size) => (
                    <NavDropdown.Item
                      key={size}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </NavDropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Item>
                <label htmlFor="color-picker"></label>
                <input
                  type="color"
                  id="color-picker"
                  value={color}
                  onChange={handleColorChange}
                  style={{ margin: "15px", gap: "5px" }}
                />
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleToolSelect("text")}>
                  <TextIcon />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleToolSelect("circle")}>
                  <CircleIcon />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleToolSelect("pen")}>
                  <Pencil />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                >
                  <Undo />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                >
                  <Redo />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={handleDownload}>
                  <Download />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={handleCloseModal}>
                  <CloseIcon />
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stage
              width={window.innerWidth - 400}
              height={window.innerHeight - 150 }
              onClick={handleImageClick}
              ref={stageRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Layer ref={layerRef}>
                {image && (
                  <Image
                    image={image}
                    width={window.innerWidth - 400}
                    height={window.innerHeight - 150}
                    style={{ objectFit: "fill" }}
                  />
                )}
                {/* <Image/> */}
                {elements.map((element, index) => (
                  <React.Fragment key={index}>{element}</React.Fragment>
                ))}
              </Layer>
            </Stage>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
