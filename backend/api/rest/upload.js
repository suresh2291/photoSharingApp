const express = require("express");
const router = express.Router();
const services = require("../../services/appServices");
const serviceInt = services.getInst();
const { imageUpload, authUser } = require("../../middlewares");
const { Kafka } = require('kafkajs');


// Set up multer middleware


// const kafka = new Kafka({
//   clientId: 'my-image-processing-app',
//   brokers: ['localhost:9092']
// });

// const producer = kafka.producer();
// const consumer = kafka.consumer({ groupId: 'my-image-processing-group' });
// // Define Kafka producer function
// const sendToKafka = async (message) => {
//   try {
//     await producer.send({
//       topic: 'image-processing',
//       messages: [
//         { value: JSON.stringify(message) }
//       ]
//     });
//   } catch (err) {
//     console.error('Error sending message to Kafka:', err);
//   }
// };


/*async function start() {
  await producer.connect();
  console.log('Kafka producer connected');
}

start().catch(console.error);

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'image-processing', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });

      // Commit the message offset to mark it as processed
      await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
    },
  });
};

run().catch(console.error);*/
//authUser
router.post("/images", authUser, imageUpload, async(req, res, next) => {
  try {  
    await serviceInt.uploadImages(req, res, next);
  } catch (err) {
    next(err)
  }
});
router.post("/upload/cloudinary", authUser, async(req, res, next) => {
  try {  
    await serviceInt.uploadCloudinaryUri(req, res, next);
  } catch (err) {
    next(err)
  }
});
module.exports = router;
