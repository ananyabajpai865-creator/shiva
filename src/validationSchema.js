import * as yup from 'yup';

const phoneRegExp = /^[0-9]{10}$/;
const gmailRegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const pincodeRegExp = /^[0-9]{6}$/;

export const validationSchema = yup.object().shape({
  // Basic Details
  fullName: yup.string().required('Full name is required'),
  mobile: yup.string().matches(phoneRegExp, 'Mobile must be 10 digits').required('Mobile is required'),
  whatsapp: yup.string().nullable().notRequired().matches(phoneRegExp, 'WhatsApp must be 10 digits'),
  telegram: yup.string().oneOf(['Yes', 'No'], 'Required').required('Telegram selection is required'),
  email: yup.string().matches(gmailRegExp, 'Must be a valid @gmail.com address').required('Email is required'),
  gender: yup.string().oneOf(['Male', 'Female', 'Non-binary'], 'Required').required('Gender is required'),
  address: yup.string().required('Address is required'),
  sameAddress: yup.string().oneOf(['Yes', 'No'], 'Required').required('Please select an option'),
  currentAddress: yup.string().when('sameAddress', {
    is: 'No',
    then: (schema) => schema.required('Current address is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  pincode: yup.string().matches(pincodeRegExp, 'Pincode must be 6 digits').required('Pincode is required'),
  photo: yup.mixed().notRequired(),
  education: yup.string().required('Education is required'),
  fatherOccupation: yup.string().oneOf(['Business', 'Job', 'Farmer', 'Self employed', 'Other'], 'Required').required('Father occupation is required'),
  businessType: yup.string().when('fatherOccupation', {
    is: 'Business',
    then: (schema) => schema.required('Business type is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Language
  hindi: yup.string().oneOf(['Yes', 'No'], 'Required').required('Please select an option'),
  englishLevel: yup.string().oneOf(['Basic', 'Intermediate', 'Fluent'], 'Required').required('English level is required'),
  nativeLanguage: yup.string().required('Native language is required'),

  // Role Selection
  workType: yup.string().oneOf(['Tele-calling', 'Field visit', 'Both'], 'Required').required('Select work type'),
  workingHours: yup.string().required('Working hours required'),
  shift: yup.string().required('Shift required'),
  daysAvailable: yup.array().min(1, 'Select at least one day').required(),
  laptop: yup.string().oneOf(['Yes', 'No'], 'Required').required('Please select'),

  // Experience & Skills
  priorTelecalling: yup.string().when('workType', {
    is: (val) => val === 'Tele-calling' || val === 'Both',
    then: (schema) => schema.oneOf(['Yes', 'No'], 'Required').required('Please select'),
    otherwise: (schema) => schema.notRequired(),
  }),
  teleExperience: yup.string().when(['workType', 'priorTelecalling'], {
    is: (workType, prior) => (workType === 'Tele-calling' || workType === 'Both') && prior === 'Yes',
    then: (schema) => schema.required('Experience required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  mysteryCalling: yup.string().when('workType', {
    is: (val) => val === 'Tele-calling' || val === 'Both',
    then: (schema) => schema.oneOf(['Yes', 'No'], 'Required').required('Please select'),
    otherwise: (schema) => schema.notRequired(),
  }),
  comfortLevel: yup.number().when('workType', {
    is: (val) => val === 'Tele-calling' || val === 'Both',
    then: (schema) => schema.required('Comfort level required').min(1).max(5),
    otherwise: (schema) => schema.notRequired(),
  }),

  fieldExperience: yup.string().when('workType', {
    is: (val) => val === 'Field visit' || val === 'Both',
    then: (schema) => schema.oneOf(['Yes', 'No'], 'Required').required('Please select'),
    otherwise: (schema) => schema.notRequired(),
  }),
  twoWheeler: yup.string().when('workType', {
    is: (val) => val === 'Field visit' || val === 'Both',
    then: (schema) => schema.oneOf(['Yes', 'No'], 'Required').required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  drivingLicense: yup.string().when('workType', {
    is: (val) => val === 'Field visit' || val === 'Both',
    then: (schema) => schema.oneOf(['Yes', 'No'], 'Required').required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  travelWithinCity: yup.string().when('workType', {
    is: (val) => val === 'Field visit' || val === 'Both',
    then: (schema) => schema.oneOf(['Yes', 'No'], 'Required').required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  travelOutsideCity: yup.string().when('workType', {
    is: (val) => val === 'Field visit' || val === 'Both',
    then: (schema) => schema.oneOf(['Yes', 'No'], 'Required').required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  preferredArea: yup.string().when('workType', {
    is: (val) => val === 'Field visit' || val === 'Both',
    then: (schema) => schema.required('Preferred area required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  coverageRange: yup.string().when('workType', {
    is: (val) => val === 'Field visit' || val === 'Both',
    then: (schema) => schema.required('Coverage range required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  nearbyCities: yup.string().notRequired(),

  // Confirmation
  confirmInfo: yup.bool().oneOf([true], 'You must confirm information is correct'),
  agreeTerms: yup.bool().oneOf([true], 'You must agree to T&C'),
});