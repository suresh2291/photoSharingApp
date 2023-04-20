export function postsReducer(state, action) {
  switch (action.type) {
    case "POSTS_REQUEST":
      return { ...state, postLoading: true, postError: "" };
    case "POSTS_SUCCESS":
      return {
        ...state,
        postLoading: false,
        posts: action.payload,
        postError: "",
      };
    case "POSTS_ERROR":
      return { ...state, postLoading: false, postError: action.payload };

    default:
      return state;
  }
}
export function profileReducer(state, action) {
  switch (action.type) {
    case "PROFILE_REQUEST":
      return { ...state, profileLoading: true, profileError: "" };
    case "PROFILE_SUCCESS":
      return {
        ...state,
        profileLoading: false,
        profile: action.payload,
        profileError: "",
      };
    case "PROFILE_POSTS":
      return {
        profileLoading: false,
        profile: { ...state.profile, posts: action.payload },
        profileError: "",
      };
    case "PROFILE_ERROR":
      return { ...state, profileLoading: false, profileError: action.payload };

    default:
      return state;
  }
}
export function photosReducer(state, action) {
  switch (action.type) {
    case "PHOTOS_REQUEST":
      return { ...state, photoLoading: true, photosError: "" };
    case "PHOTOS_SUCCESS":
      return {
        ...state,
        photoLoading: false,
        photos: action.payload,
        photosError: "",
      };
    case "PHOTOS_ERROR":
      return { ...state, photoLoading: false, photosError: action.payload };

    default:
      return state;
  }
}

export function friendspage(state, action) {
  switch (action.type) {
    case "FRIENDS_REQUEST":
      return { ...state, friendsLoading: true, friendsError: "" };
    case "FRIENDS_SUCCESS":
      return {
        ...state,
        friendsLoading: false,
        data: action.payload,
        friendsError: "",
      };
    case "FRIENDS_ERROR":
      return { ...state, friendsLoading: false, friendsError: action.payload };

    default:
      return state;
  }
}