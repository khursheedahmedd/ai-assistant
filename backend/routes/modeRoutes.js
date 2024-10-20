const express = require('express');
const {
    processPictureMode,
    processTranslationMode,
    processAssistantMode,
    processHealthMode,
    processLearnMode,
    processSpeechMode,
    simpleAssistantMode
} = require('../controllers/modeControllers');

const router = express.Router();

router.post('/picture', processPictureMode);
router.post('/translation', processTranslationMode);
router.post('/assistant/image', processAssistantMode);
router.post('/assistant/text', simpleAssistantMode);
router.post('/health', processHealthMode);
router.post('/learn', processLearnMode);
router.post('/speech', processSpeechMode);

module.exports = router;
