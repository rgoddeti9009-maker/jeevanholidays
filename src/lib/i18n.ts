import type { ServiceId } from '@/data/fixtures'

export type Lang = 'en' | 'hi' | 'mr' | 'te'

export const languages: { id: Lang; label: string; native: string; speech: string }[] = [
  { id: 'en', label: 'English', native: 'English', speech: 'en-IN' },
  { id: 'hi', label: 'Hindi', native: 'हिंदी', speech: 'hi-IN' },
  { id: 'mr', label: 'Marathi', native: 'मराठी', speech: 'mr-IN' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు', speech: 'te-IN' },
]

type Dict = {
  welcome: string
  howHelp: string
  whereGo: string
  searchPlaceholder: string
  selectLanguage: string
  speakLanguage: string
  touchToStart: string
  askAi: string
  askAiSub: string
  voice: string
  voiceSub: string
  tapSpeak: string
  listening: string
  speakAgain: string
  whatsapp: string
  callStaff: string
  needHelp: string
  staffAssist: string
  home: string
  back: string
  help: string
  startOver: string
  book: string
  packages: string
  myTrip: string
  explore: string
  getFare: string
  next: string
  edit: string
  confirm: string
  print: string
  pdf: string
  repeat: string
  stopVoice: string
  stillBooking: string
  continue: string
  startNew: string
  sessionEnded: string
  continuePhone: string
  scanQr: string
  continueHere: string
  bookOnPhone: string
  from: string
  to: string
  date: string
  time: string
  passengers: string
  luggage: string
  vehicle: string
  name: string
  mobile: string
  quotation: string
  total: string
  advance: string
  balance: string
  includes: string
  excludes: string
  payAtCounter: string
  notConnected: string
  customFare: string
  talkStaff: string
  services: Record<ServiceId, string>
  ai: {
    greeting: string
    askFrom: string
    askTo: string
    askDate: string
    askTime: string
    askPax: string
    askVehicle: string
    ready: string
    noRate: string
    unclear: string
    planner: string
  }
}

const en: Dict = {
  welcome: 'Welcome',
  howHelp: 'How can we help you today?',
  whereGo: 'Where would you like to go?',
  searchPlaceholder: 'Type or speak destination',
  selectLanguage: 'Select language',
  speakLanguage: 'Speak your language',
  touchToStart: 'Touch anywhere to begin',
  askAi: 'Ask Jeevan AI',
  askAiSub: 'Tell me your travel requirement.',
  voice: 'Voice booking',
  voiceSub: 'Tap and speak.',
  tapSpeak: 'Tap & speak',
  listening: 'Listening…',
  speakAgain: 'Please speak again.',
  whatsapp: 'WhatsApp',
  callStaff: 'Call staff',
  needHelp: 'Need help?',
  staffAssist: 'Staff assistance',
  home: 'Home',
  back: 'Back',
  help: 'Help',
  startOver: 'Start over',
  book: 'Book',
  packages: 'Packages',
  myTrip: 'My Trip',
  explore: 'Explore',
  getFare: 'Get fare',
  next: 'Next',
  edit: 'Edit',
  confirm: 'Confirm',
  print: 'Print',
  pdf: 'Download PDF',
  repeat: 'Repeat',
  stopVoice: 'Stop voice',
  stillBooking: 'Are you still booking?',
  continue: 'Continue',
  startNew: 'Start new',
  sessionEnded: 'Your session has ended for privacy. Welcome to Jeevan Holidays.',
  continuePhone: 'Would you like to continue on your phone?',
  scanQr: 'Yes — scan QR',
  continueHere: 'No — continue here',
  bookOnPhone: 'Book on your phone',
  from: 'From',
  to: 'To',
  date: 'Date',
  time: 'Time',
  passengers: 'Passengers',
  luggage: 'Luggage',
  vehicle: 'Vehicle',
  name: 'Your name',
  mobile: 'Mobile / WhatsApp',
  quotation: 'Quotation',
  total: 'Total',
  advance: 'Advance',
  balance: 'Balance',
  includes: 'Includes',
  excludes: 'Excludes',
  payAtCounter: 'Pay at counter',
  notConnected: 'Not connected',
  customFare: 'We will check the latest fare and availability.',
  talkStaff: 'Talk to Jeevan Holidays staff',
  services: {
    oneway: 'One Way Cab',
    roundtrip: 'Round Trip',
    sightseeing: 'Sightseeing',
    packages: 'Tour Packages',
    airport: 'Airport Transfer',
    railway: 'Railway Transfer',
    hotel: 'Hotel',
    bus: 'Bus',
    flight: 'Flight',
    rental: 'Car Rental',
  },
  ai: {
    greeting: 'Namaste! I am Jeevan AI. Tell me where you want to go — for example, “Shirdi to Nashik tomorrow for 4 people”.',
    askFrom: 'Where should we pick you up?',
    askTo: 'Where would you like to go?',
    askDate: 'Which date would you like to travel?',
    askTime: 'What time would you like to leave?',
    askPax: 'How many people are travelling?',
    askVehicle: 'Which vehicle would you prefer?',
    ready: 'Thank you. Here is your trip. Tap “Get quotation” to see the current fare.',
    noRate: 'I’m unable to access a current fare for this route. I can create an enquiry for Jeevan Holidays.',
    unclear: 'Sorry, I did not understand. Please speak again or tap an option.',
    planner: 'Lovely! To plan your trip I need: starting point, passengers, budget, vehicle, hotel needed, and places you’d like to see. Here is a draft using our day tours:',
  },
}

const hi: Dict = {
  welcome: 'स्वागत है',
  howHelp: 'आज हम आपकी क्या मदद कर सकते हैं?',
  whereGo: 'आप कहाँ जाना चाहते हैं?',
  searchPlaceholder: 'गंतव्य लिखें या बोलें',
  selectLanguage: 'भाषा चुनें',
  speakLanguage: 'अपनी भाषा में बोलें',
  touchToStart: 'शुरू करने के लिए कहीं भी छुएँ',
  askAi: 'जीवन AI से पूछें',
  askAiSub: 'अपनी यात्रा की ज़रूरत बताइए।',
  voice: 'आवाज़ से बुकिंग',
  voiceSub: 'दबाएँ और बोलें।',
  tapSpeak: 'दबाएँ और बोलें',
  listening: 'सुन रहे हैं…',
  speakAgain: 'कृपया फिर से बोलें।',
  whatsapp: 'व्हाट्सऐप',
  callStaff: 'स्टाफ़ को कॉल करें',
  needHelp: 'मदद चाहिए?',
  staffAssist: 'स्टाफ़ सहायता',
  home: 'होम',
  back: 'पीछे',
  help: 'मदद',
  startOver: 'फिर से शुरू',
  book: 'बुक करें',
  packages: 'पैकेज',
  myTrip: 'मेरी यात्रा',
  explore: 'खोजें',
  getFare: 'किराया देखें',
  next: 'आगे',
  edit: 'बदलें',
  confirm: 'पुष्टि करें',
  print: 'प्रिंट',
  pdf: 'PDF डाउनलोड',
  repeat: 'दोहराएँ',
  stopVoice: 'आवाज़ बंद',
  stillBooking: 'क्या आप अभी बुकिंग कर रहे हैं?',
  continue: 'जारी रखें',
  startNew: 'नया शुरू करें',
  sessionEnded: 'गोपनीयता के लिए आपका सत्र समाप्त हुआ। जीवन हॉलिडेज़ में आपका स्वागत है।',
  continuePhone: 'क्या आप अपने फ़ोन पर जारी रखना चाहेंगे?',
  scanQr: 'हाँ — QR स्कैन करें',
  continueHere: 'नहीं — यहीं जारी रखें',
  bookOnPhone: 'अपने फ़ोन पर बुक करें',
  from: 'कहाँ से',
  to: 'कहाँ तक',
  date: 'तारीख़',
  time: 'समय',
  passengers: 'यात्री',
  luggage: 'सामान',
  vehicle: 'गाड़ी',
  name: 'आपका नाम',
  mobile: 'मोबाइल / व्हाट्सऐप',
  quotation: 'कोटेशन',
  total: 'कुल',
  advance: 'अग्रिम',
  balance: 'बाकी',
  includes: 'शामिल',
  excludes: 'शामिल नहीं',
  payAtCounter: 'काउंटर पर भुगतान',
  notConnected: 'कनेक्ट नहीं',
  customFare: 'हम नवीनतम किराया और उपलब्धता की जाँच करेंगे।',
  talkStaff: 'जीवन हॉलिडेज़ स्टाफ़ से बात करें',
  services: {
    oneway: 'वन वे कैब',
    roundtrip: 'राउंड ट्रिप',
    sightseeing: 'दर्शन / घूमना',
    packages: 'टूर पैकेज',
    airport: 'एयरपोर्ट ट्रांसफ़र',
    railway: 'रेलवे ट्रांसफ़र',
    hotel: 'होटल',
    bus: 'बस',
    flight: 'फ़्लाइट',
    rental: 'कार किराये पर',
  },
  ai: {
    greeting: 'नमस्ते! मैं जीवन AI हूँ। बताइए कहाँ जाना है — जैसे “कल चार लोगों के लिए शिर्डी से नासिक”।',
    askFrom: 'हम आपको कहाँ से लें?',
    askTo: 'आप कहाँ जाना चाहते हैं?',
    askDate: 'आप किस तारीख़ को यात्रा करना चाहते हैं?',
    askTime: 'आप किस समय निकलना चाहेंगे?',
    askPax: 'कितने लोग यात्रा कर रहे हैं?',
    askVehicle: 'आप कौन सी गाड़ी पसंद करेंगे?',
    ready: 'धन्यवाद। यह आपकी यात्रा है। वर्तमान किराया देखने के लिए “कोटेशन देखें” दबाएँ।',
    noRate: 'इस मार्ग का वर्तमान किराया उपलब्ध नहीं है। मैं जीवन हॉलिडेज़ के लिए पूछताछ बना सकता हूँ।',
    unclear: 'माफ़ कीजिए, समझ नहीं आया। कृपया फिर से बोलें या कोई विकल्प दबाएँ।',
    planner: 'बहुत अच्छा! योजना के लिए चाहिए: शुरुआत की जगह, यात्री, बजट, गाड़ी, होटल, और पसंदीदा स्थान। हमारे टूर से एक मसौदा:',
  },
}

const mr: Dict = {
  welcome: 'स्वागत आहे',
  howHelp: 'आज आम्ही आपली कशी मदत करू?',
  whereGo: 'आपल्याला कुठे जायचे आहे?',
  searchPlaceholder: 'ठिकाण लिहा किंवा बोला',
  selectLanguage: 'भाषा निवडा',
  speakLanguage: 'आपल्या भाषेत बोला',
  touchToStart: 'सुरू करण्यासाठी कुठेही स्पर्श करा',
  askAi: 'जीवन AI ला विचारा',
  askAiSub: 'आपली प्रवासाची गरज सांगा.',
  voice: 'आवाजाने बुकिंग',
  voiceSub: 'दाबा आणि बोला.',
  tapSpeak: 'दाबा आणि बोला',
  listening: 'ऐकत आहोत…',
  speakAgain: 'कृपया पुन्हा बोला.',
  whatsapp: 'व्हॉट्सअ‍ॅप',
  callStaff: 'स्टाफला कॉल करा',
  needHelp: 'मदत हवी?',
  staffAssist: 'स्टाफ सहाय्य',
  home: 'मुख्य',
  back: 'मागे',
  help: 'मदत',
  startOver: 'पुन्हा सुरू करा',
  book: 'बुक करा',
  packages: 'पॅकेज',
  myTrip: 'माझी सहल',
  explore: 'शोधा',
  getFare: 'भाडे पहा',
  next: 'पुढे',
  edit: 'बदला',
  confirm: 'खात्री करा',
  print: 'प्रिंट',
  pdf: 'PDF डाउनलोड',
  repeat: 'पुन्हा ऐका',
  stopVoice: 'आवाज बंद',
  stillBooking: 'आपण अजून बुकिंग करत आहात का?',
  continue: 'सुरू ठेवा',
  startNew: 'नवीन सुरू करा',
  sessionEnded: 'गोपनीयतेसाठी आपले सत्र संपले. जीवन हॉलिडेज मध्ये आपले स्वागत आहे.',
  continuePhone: 'आपण आपल्या फोनवर पुढे सुरू ठेवू इच्छिता का?',
  scanQr: 'होय — QR स्कॅन करा',
  continueHere: 'नाही — इथेच सुरू ठेवा',
  bookOnPhone: 'आपल्या फोनवर बुक करा',
  from: 'कुठून',
  to: 'कुठे',
  date: 'तारीख',
  time: 'वेळ',
  passengers: 'प्रवासी',
  luggage: 'सामान',
  vehicle: 'गाडी',
  name: 'आपले नाव',
  mobile: 'मोबाईल / व्हॉट्सअ‍ॅप',
  quotation: 'कोटेशन',
  total: 'एकूण',
  advance: 'आगाऊ',
  balance: 'उर्वरित',
  includes: 'समाविष्ट',
  excludes: 'समाविष्ट नाही',
  payAtCounter: 'काउंटरवर पैसे भरा',
  notConnected: 'जोडलेले नाही',
  customFare: 'आम्ही नवीनतम भाडे आणि उपलब्धता तपासू.',
  talkStaff: 'जीवन हॉलिडेज स्टाफशी बोला',
  services: {
    oneway: 'वन वे कॅब',
    roundtrip: 'राउंड ट्रिप',
    sightseeing: 'दर्शन सहल',
    packages: 'टूर पॅकेज',
    airport: 'विमानतळ ट्रान्सफर',
    railway: 'रेल्वे ट्रान्सफर',
    hotel: 'हॉटेल',
    bus: 'बस',
    flight: 'विमान',
    rental: 'कार भाड्याने',
  },
  ai: {
    greeting: 'नमस्कार! मी जीवन AI. कुठे जायचे ते सांगा — उदा. “उद्या चार जणांसाठी शिर्डी ते नाशिक”.',
    askFrom: 'आम्ही आपल्याला कुठून घ्यावे?',
    askTo: 'आपल्याला कुठे जायचे आहे?',
    askDate: 'आपण कोणत्या तारखेला प्रवास करणार?',
    askTime: 'आपण किती वाजता निघू इच्छिता?',
    askPax: 'किती लोक प्रवास करणार आहेत?',
    askVehicle: 'आपल्याला कोणती गाडी हवी?',
    ready: 'धन्यवाद. ही आपली सहल. सध्याचे भाडे पाहण्यासाठी “कोटेशन पहा” दाबा.',
    noRate: 'या मार्गाचे सध्याचे भाडे उपलब्ध नाही. मी जीवन हॉलिडेजसाठी चौकशी तयार करू शकतो.',
    unclear: 'माफ करा, समजले नाही. कृपया पुन्हा बोला किंवा पर्याय दाबा.',
    planner: 'छान! नियोजनासाठी हवे: सुरुवातीचे ठिकाण, प्रवासी, बजेट, गाडी, हॉटेल, आणि आवडती ठिकाणे. आमच्या सहलींमधून एक मसुदा:',
  },
}

const te: Dict = {
  welcome: 'స్వాగతం',
  howHelp: 'ఈ రోజు మేము మీకు ఎలా సహాయం చేయగలం?',
  whereGo: 'మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారు?',
  searchPlaceholder: 'గమ్యం టైప్ చేయండి లేదా చెప్పండి',
  selectLanguage: 'భాషను ఎంచుకోండి',
  speakLanguage: 'మీ భాషలో మాట్లాడండి',
  touchToStart: 'ప్రారంభించడానికి ఎక్కడైనా తాకండి',
  askAi: 'జీవన్ AI ని అడగండి',
  askAiSub: 'మీ ప్రయాణ అవసరం చెప్పండి.',
  voice: 'వాయిస్ బుకింగ్',
  voiceSub: 'నొక్కి మాట్లాడండి.',
  tapSpeak: 'నొక్కి మాట్లాడండి',
  listening: 'వింటున్నాం…',
  speakAgain: 'దయచేసి మళ్ళీ చెప్పండి.',
  whatsapp: 'వాట్సాప్',
  callStaff: 'సిబ్బందికి కాల్',
  needHelp: 'సహాయం కావాలా?',
  staffAssist: 'సిబ్బంది సహాయం',
  home: 'హోమ్',
  back: 'వెనుకకు',
  help: 'సహాయం',
  startOver: 'మళ్ళీ ప్రారంభించండి',
  book: 'బుక్',
  packages: 'ప్యాకేజీలు',
  myTrip: 'నా ప్రయాణం',
  explore: 'అన్వేషించండి',
  getFare: 'ఛార్జీ చూడండి',
  next: 'తదుపరి',
  edit: 'మార్చండి',
  confirm: 'నిర్ధారించండి',
  print: 'ప్రింట్',
  pdf: 'PDF డౌన్‌లోడ్',
  repeat: 'మళ్ళీ వినండి',
  stopVoice: 'వాయిస్ ఆపండి',
  stillBooking: 'మీరు ఇంకా బుక్ చేస్తున్నారా?',
  continue: 'కొనసాగించండి',
  startNew: 'కొత్తగా ప్రారంభించండి',
  sessionEnded: 'గోప్యత కోసం మీ సెషన్ ముగిసింది. జీవన్ హాలిడేస్‌కు స్వాగతం.',
  continuePhone: 'మీ ఫోన్‌లో కొనసాగించాలనుకుంటున్నారా?',
  scanQr: 'అవును — QR స్కాన్ చేయండి',
  continueHere: 'కాదు — ఇక్కడే కొనసాగించండి',
  bookOnPhone: 'మీ ఫోన్‌లో బుక్ చేయండి',
  from: 'ఎక్కడ నుండి',
  to: 'ఎక్కడికి',
  date: 'తేదీ',
  time: 'సమయం',
  passengers: 'ప్రయాణికులు',
  luggage: 'లగేజీ',
  vehicle: 'వాహనం',
  name: 'మీ పేరు',
  mobile: 'మొబైల్ / వాట్సాప్',
  quotation: 'కొటేషన్',
  total: 'మొత్తం',
  advance: 'అడ్వాన్స్',
  balance: 'మిగిలినది',
  includes: 'కలిపి',
  excludes: 'కలపనివి',
  payAtCounter: 'కౌంటర్‌లో చెల్లించండి',
  notConnected: 'కనెక్ట్ కాలేదు',
  customFare: 'మేము తాజా ఛార్జీ మరియు లభ్యతను తనిఖీ చేస్తాము.',
  talkStaff: 'జీవన్ హాలిడేస్ సిబ్బందితో మాట్లాడండి',
  services: {
    oneway: 'వన్ వే క్యాబ్',
    roundtrip: 'రౌండ్ ట్రిప్',
    sightseeing: 'సందర్శన',
    packages: 'టూర్ ప్యాకేజీలు',
    airport: 'ఎయిర్‌పోర్ట్ ట్రాన్స్‌ఫర్',
    railway: 'రైల్వే ట్రాన్స్‌ఫర్',
    hotel: 'హోటల్',
    bus: 'బస్',
    flight: 'ఫ్లైట్',
    rental: 'కార్ అద్దె',
  },
  ai: {
    greeting: 'నమస్తే! నేను జీవన్ AI. ఎక్కడికి వెళ్లాలో చెప్పండి — ఉదా. “రేపు నలుగురికి షిర్డీ నుండి నాసిక్”.',
    askFrom: 'మిమ్మల్ని ఎక్కడ పికప్ చేయాలి?',
    askTo: 'మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారు?',
    askDate: 'ఏ తేదీన ప్రయాణం చేయాలనుకుంటున్నారు?',
    askTime: 'ఏ సమయానికి బయలుదేరాలనుకుంటున్నారు?',
    askPax: 'ఎంత మంది ప్రయాణిస్తున్నారు?',
    askVehicle: 'మీకు ఏ వాహనం కావాలి?',
    ready: 'ధన్యవాదాలు. ఇది మీ ప్రయాణం. ప్రస్తుత ఛార్జీ చూడటానికి “కొటేషన్ చూడండి” నొక్కండి.',
    noRate: 'ఈ మార్గానికి ప్రస్తుత ఛార్జీ అందుబాటులో లేదు. జీవన్ హాలిడేస్ కోసం విచారణ సృష్టించగలను.',
    unclear: 'క్షమించండి, అర్థం కాలేదు. దయచేసి మళ్ళీ చెప్పండి లేదా ఎంపికను నొక్కండి.',
    planner: 'చాలా బాగుంది! ప్రణాళిక కోసం కావాలి: ప్రారంభ స్థలం, ప్రయాణికులు, బడ్జెట్, వాహనం, హోటల్, మరియు ఇష్టమైన ప్రదేశాలు. మా టూర్ల నుండి ఒక ముసాయిదా:',
  },
}

export const dictionaries: Record<Lang, Dict> = { en, hi, mr, te }
export type { Dict }
