// Patient-facing text in English, Hindi and Marathi.
export const RED_FLAGS = ['chest_pain', 'breathless', 'fainting', 'heavy_bleeding', 'confusion'];
export const SYMPTOM_KEYS = [...RED_FLAGS, 'wound_discharge', 'vomiting', 'swelling', 'dizziness', 'cough'];

export const STRINGS = {
  en: {
    name: 'English', hello: 'Hello', title: "Today's check-in", temperature: 'Temperature (°F)', spo2: 'Oxygen level (SpO₂ %)',
    pulse: 'Pulse (per minute)', bpTop: 'BP top number', bpBottom: 'BP bottom number', sugar: 'Blood sugar (mg/dL)',
    pain: 'Pain (0 = none, 10 = worst)', symptoms: 'Any of these today?', meds: 'I took all my medicines today',
    note: 'Anything else?', submit: 'Send check-in', video: 'Ask for a video call with the doctor', joinCall: 'Join video call',
    advice: 'Message from your care team', history: 'Recent check-ins', nextVisit: 'Next hospital visit',
    savedOffline: 'Saved on this phone. It will send when internet returns.', sent: 'Sent. Thank you.',
    pending: 'waiting to send', emergency: 'Get medical help now. Call 108 or go to the nearest hospital.',
    optional: 'Fill what you can. Skip what you cannot measure.', callAsked: 'Request sent. Your care team will reply here.', signOut: 'Sign out',
    level: { green: ['Doing well', 'Keep resting and take your medicines on time.'], amber: ['Team will call', 'Your care team has been told and will contact you.'], red: ['Get help now', 'Get medical help now. Call 108 or go to the nearest hospital.'] },
    decision: { remote: 'Keep recovering at home', teleconsult: 'Video call with doctor', visit: 'Please visit the hospital' },
    sym: { chest_pain: 'Chest pain', breathless: 'Trouble breathing', fainting: 'Fainting', heavy_bleeding: 'Heavy bleeding', confusion: 'Confusion', wound_discharge: 'Wound leaking or red', vomiting: 'Vomiting', swelling: 'New swelling', dizziness: 'Dizziness', cough: 'Bad cough' }
  },
  hi: {
    name: 'हिन्दी', hello: 'नमस्ते', title: 'आज की जाँच', temperature: 'तापमान (°F)', spo2: 'ऑक्सीजन स्तर (SpO₂ %)',
    pulse: 'नाड़ी (प्रति मिनट)', bpTop: 'रक्तचाप - ऊपर की संख्या', bpBottom: 'रक्तचाप - नीचे की संख्या', sugar: 'ब्लड शुगर (mg/dL)',
    pain: 'दर्द (0 = नहीं, 10 = सबसे ज़्यादा)', symptoms: 'आज इनमें से कोई तकलीफ़?', meds: 'मैंने आज सारी दवाइयाँ लीं',
    note: 'कुछ और बताना है?', submit: 'जाँच भेजें', video: 'डॉक्टर से वीडियो कॉल माँगें', joinCall: 'वीडियो कॉल से जुड़ें',
    advice: 'आपकी देखभाल टीम का संदेश', history: 'पिछली जाँचें', nextVisit: 'अगली अस्पताल विज़िट',
    savedOffline: 'फ़ोन में सेव हो गया। इंटरनेट आने पर भेज दिया जाएगा।', sent: 'भेज दिया गया। धन्यवाद।',
    pending: 'भेजने के लिए प्रतीक्षा में', emergency: 'अभी डॉक्टरी मदद लें। 108 पर कॉल करें या नज़दीकी अस्पताल जाएँ।',
    optional: 'जो माप सकें वह भरें। बाकी छोड़ दें।', callAsked: 'अनुरोध भेज दिया गया। देखभाल टीम यहीं जवाब देगी।', signOut: 'साइन आउट',
    level: { green: ['ठीक हैं', 'आराम करें और दवाइयाँ समय पर लें।'], amber: ['टीम फ़ोन करेगी', 'आपकी देखभाल टीम को सूचना दे दी गई है, वे आपसे संपर्क करेंगे।'], red: ['अभी मदद लें', 'अभी डॉक्टरी मदद लें। 108 पर कॉल करें या नज़दीकी अस्पताल जाएँ।'] },
    decision: { remote: 'घर पर आराम जारी रखें', teleconsult: 'डॉक्टर के साथ वीडियो कॉल', visit: 'कृपया अस्पताल आएँ' },
    sym: { chest_pain: 'सीने में दर्द', breathless: 'साँस लेने में तकलीफ़', fainting: 'बेहोशी', heavy_bleeding: 'ज़्यादा खून बहना', confusion: 'भ्रम / उलझन', wound_discharge: 'घाव से रिसाव / लालिमा', vomiting: 'उल्टी', swelling: 'नई सूजन', dizziness: 'चक्कर आना', cough: 'तेज़ खाँसी' }
  },
  mr: {
    name: 'मराठी', hello: 'नमस्कार', title: 'आजची तपासणी', temperature: 'तापमान (°F)', spo2: 'ऑक्सिजन पातळी (SpO₂ %)',
    pulse: 'नाडी (प्रति मिनिट)', bpTop: 'रक्तदाब - वरचा आकडा', bpBottom: 'रक्तदाब - खालचा आकडा', sugar: 'रक्तातील साखर (mg/dL)',
    pain: 'वेदना (0 = नाही, 10 = सर्वात जास्त)', symptoms: 'आज यापैकी काही त्रास?', meds: 'मी आज सर्व औषधे घेतली',
    note: 'आणखी काही सांगायचे आहे?', submit: 'तपासणी पाठवा', video: 'डॉक्टरांशी व्हिडिओ कॉल मागवा', joinCall: 'व्हिडिओ कॉलमध्ये सामील व्हा',
    advice: 'तुमच्या काळजी टीमचा संदेश', history: 'मागील तपासण्या', nextVisit: 'पुढील रुग्णालय भेट',
    savedOffline: 'फोनमध्ये जतन केले. इंटरनेट आल्यावर पाठवले जाईल.', sent: 'पाठवले. धन्यवाद.',
    pending: 'पाठवण्यासाठी प्रतीक्षेत', emergency: 'आत्ता वैद्यकीय मदत घ्या. 108 वर कॉल करा किंवा जवळच्या रुग्णालयात जा.',
    optional: 'जे मोजता येईल ते भरा. बाकी सोडून द्या.', callAsked: 'विनंती पाठवली. काळजी टीम इथेच उत्तर देईल.', signOut: 'साइन आउट',
    level: { green: ['बरे आहात', 'विश्रांती घ्या आणि औषधे वेळेवर घ्या.'], amber: ['टीम फोन करेल', 'तुमच्या काळजी टीमला कळवले आहे, ते तुमच्याशी संपर्क करतील.'], red: ['आत्ता मदत घ्या', 'आत्ता वैद्यकीय मदत घ्या. 108 वर कॉल करा किंवा जवळच्या रुग्णालयात जा.'] },
    decision: { remote: 'घरीच विश्रांती सुरू ठेवा', teleconsult: 'डॉक्टरांशी व्हिडिओ कॉल', visit: 'कृपया रुग्णालयात या' },
    sym: { chest_pain: 'छातीत दुखणे', breathless: 'श्वास घेण्यास त्रास', fainting: 'बेशुद्ध पडणे', heavy_bleeding: 'जास्त रक्तस्राव', confusion: 'गोंधळ', wound_discharge: 'जखमेतून स्राव / लालसरपणा', vomiting: 'उलट्या', swelling: 'नवीन सूज', dizziness: 'चक्कर येणे', cough: 'जोरदार खोकला' }
  }
};
