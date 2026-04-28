'use strict';

const nodemailer = require('nodemailer');

/* ─────────────────────────────────────────────────────────
   FIELD LABELS — maps raw field names to readable labels
───────────────────────────────────────────────────────── */
const LABELS = {
  // Contact / personal
  coverage_types:                  'Coverage Types',
  first_name:                      'First Name',
  last_name:                       'Last Name',
  dob:                             'Date of Birth',
  marital_status:                  'Marital Status',
  spouse_first_name:               'Spouse First Name',
  spouse_last_name:                'Spouse Last Name',
  spouse_dob:                      'Spouse DOB',
  dog_count:                       'Number of Dogs',
  dog_breeds:                      'Dog Breeds',
  email:                           'Email',
  phone:                           'Phone',
  street_address:                  'Street Address',
  city:                            'City',
  state:                           'State',
  zip:                             'ZIP',
  dependents:                      'Dependents in Household',
  best_time_to_call:               'Best Time to Call',

  // Auto
  auto_current_carrier:            'Current Carrier',
  auto_policy_expiration:          'Policy Expiration',
  driver1_occupation:              'Driver 1 — Occupation',
  driver1_license:                 'Driver 1 — License # & State',
  driver1_violations:              'Driver 1 — Tickets / Accidents',
  driver2_name:                    'Driver 2 — Name',
  driver2_dob:                     'Driver 2 — DOB',
  driver2_occupation:              'Driver 2 — Occupation',
  driver2_license:                 'Driver 2 — License # & State',
  driver2_violations:              'Driver 2 — Tickets / Accidents',
  driver3_name:                    'Driver 3 — Name',
  driver3_dob:                     'Driver 3 — DOB',
  driver3_occupation:              'Driver 3 — Occupation',
  driver3_license:                 'Driver 3 — License # & State',
  driver3_violations:              'Driver 3 — Tickets / Accidents',
  driver4_name:                    'Driver 4 — Name',
  driver4_dob:                     'Driver 4 — DOB',
  driver4_occupation:              'Driver 4 — Occupation',
  driver4_license:                 'Driver 4 — License # & State',
  driver4_violations:              'Driver 4 — Tickets / Accidents',
  v1_year:                         'Vehicle 1 — Year',
  v1_make:                         'Vehicle 1 — Make',
  v1_model:                        'Vehicle 1 — Model',
  v1_assigned_driver:              'Vehicle 1 — Assigned Driver',
  v1_vin:                          'Vehicle 1 — VIN',
  v1_comp_collision:               'Vehicle 1 — Comp/Collision',
  v1_ownership:                    'Vehicle 1 — Financed/Leased/Own',
  v1_finance_co:                   'Vehicle 1 — Finance/Lease Co.',
  v2_year:                         'Vehicle 2 — Year',
  v2_make:                         'Vehicle 2 — Make',
  v2_model:                        'Vehicle 2 — Model',
  v2_assigned_driver:              'Vehicle 2 — Assigned Driver',
  v2_vin:                          'Vehicle 2 — VIN',
  v2_comp_collision:               'Vehicle 2 — Comp/Collision',
  v2_ownership:                    'Vehicle 2 — Financed/Leased/Own',
  v2_finance_co:                   'Vehicle 2 — Finance/Lease Co.',
  v3_year:                         'Vehicle 3 — Year',
  v3_make:                         'Vehicle 3 — Make',
  v3_model:                        'Vehicle 3 — Model',
  v3_assigned_driver:              'Vehicle 3 — Assigned Driver',
  v3_vin:                          'Vehicle 3 — VIN',
  v3_comp_collision:               'Vehicle 3 — Comp/Collision',
  v3_ownership:                    'Vehicle 3 — Financed/Leased/Own',
  v3_finance_co:                   'Vehicle 3 — Finance/Lease Co.',
  v4_year:                         'Vehicle 4 — Year',
  v4_make:                         'Vehicle 4 — Make',
  v4_model:                        'Vehicle 4 — Model',
  v4_assigned_driver:              'Vehicle 4 — Assigned Driver',
  v4_vin:                          'Vehicle 4 — VIN',
  v4_comp_collision:               'Vehicle 4 — Comp/Collision',
  v4_ownership:                    'Vehicle 4 — Financed/Leased/Own',
  v4_finance_co:                   'Vehicle 4 — Finance/Lease Co.',
  auto_limits:                     'Liability Limits',
  auto_rent_own:                   'Rent or Own Home',
  auto_medical_carrier:            'Medical Insurance Carrier',
  household_count:                 'People in Household',
  household_members:               'Household Members',

  // Home
  home_new_purchase:               'New Purchase',
  home_closing_date:               'Closing Date',
  home_mortgage:                   'Mortgage on Property',
  home_current_carrier:            'Current Carrier',
  home_carrier_exp:                'Policy Expiration',
  home_additional_insured:         'Additional Insured — Name',
  home_additional_insured_dob:     'Additional Insured — DOB',
  home_additional_insured_address: 'Additional Insured — Address',
  home_llc:                        'Owned by LLC / Trust / Estate',
  home_llc_name:                   'Entity Name',
  fire_hydrant:                    'Within 1,000 ft of Hydrant',
  home_property_type:              'Property Type',
  home_renting:                    'Currently Renting Property',
  home_renting_duration:           'Rental Duration',
  year_built:                      'Year Built',
  sq_footage:                      'Square Footage',
  foundation_type:                 'Foundation Type',
  basement_finished:               'Basement Finished',
  bedrooms:                        'Bedrooms',
  bathrooms:                       'Bathrooms',
  single_family:                   'Single Family Home',
  num_families:                    'Number of Families',
  home_garage:                     'Garage',
  roof_type:                       'Roof Type',
  roof_updates:                    'Last Roof Update',
  asbestos_siding:                 'Asbestos Siding',
  wood_stove:                      'Wood Burning Stove',
  stucco:                          'Stucco Exterior',
  heat_type:                       'Heat Type',
  oil_tank:                        'Oil Tank Location',
  system_updates:                  'System Updates (Elec / Plumbing / Heat)',
  solar_panels:                    'Solar Panels',
  solar_count:                     'Number of Solar Panels',
  solar_ownership:                 'Solar Panels — Leased or Owned',
  pool:                            'Pool on Property',
  pool_type:                       'Pool Type',
  diving_board:                    'Diving Board or Slide',
  pool_fenced:                     'Pool Fenced',
  trampoline:                      'Trampoline',
  trampoline_fenced:               'Trampoline Fenced / Enclosed',
  dog_on_property:                 'Dog on Property',
  home_dog_breed:                  'Dog Breed',
  dog_bite_claims:                 'Bite Claims',
  farming:                         'Farming / Livestock',
  farming_type:                    'Farming Type',
  home_claims_history:             'Prior Claims',
  home_claims_detail:              'Claim Details',
  security_alarm:                  'Security Alarm',
  alarm_type:                      'Alarm Type',
  business_exposure:               'Business Run from Home',
  renovations:                     'Renovations Planned / In Progress',
  renovation_plans:                'What Is Being Renovated',
  renovation_budget:               'Renovation Budget',
  renovation_timeframe:            'Renovation Timeframe',
  flood_quote_interest:            'Interested in Flood Quote',
  elevation_cert:                  'Elevation Certificate Available',
  home_property_address:           'Property Address (if different)',

  // Flood
  flood_property_address:          'Property Address',
  flood_property_type:             'Property Type',
  flood_foundation:                'Foundation Type',
  flood_elevation_cert:            'Elevation Certificate Available',
  flood_current_carrier:           'Current Flood Carrier',
  flood_carrier_exp:               'Current Policy Expiration',
  flood_coverage_amount:           'Desired Coverage Amount',

  // Business
  business_name:                   'Business Name',
  industry:                        'Industry / Business Type',
  num_employees:                   'Number of Employees',
  annual_revenue:                  'Annual Revenue',
  biz_coverage:                    'Coverage Needed',
  years_in_business:               'Years in Business',

  // Watercraft
  vessel_type:                     'Vessel Type',
  vessel_year:                     'Vessel Year',
  vessel_length:                   'Vessel Length (ft)',
  vessel_value:                    'Estimated Value',
  marina_stored:                   'Stored at Marina',

  // Current coverage / wrap-up
  currently_insured:               'Currently Insured',
  primary_carrier:                 'Current Primary Carrier',
  shopping_reason:                 'Reason for Shopping',
  start_date:                      'Desired Start Date',
  referral_source:                 'How Did They Hear About Us',
  notes:                           'Additional Notes',
};

/* ─────────────────────────────────────────────────────────
   SECTIONS — ordered field groups for email layout
───────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    title: 'Contact Information',
    fields: [
      'coverage_types','first_name','last_name','dob','marital_status',
      'spouse_first_name','spouse_last_name','spouse_dob',
      'email','phone','street_address','city','state','zip',
      'dependents','dog_count','dog_breeds','best_time_to_call',
    ],
  },
  {
    title: 'Auto Insurance',
    fields: [
      'auto_current_carrier','auto_policy_expiration',
      'driver1_occupation','driver1_license','driver1_violations',
      'driver2_name','driver2_dob','driver2_occupation','driver2_license','driver2_violations',
      'driver3_name','driver3_dob','driver3_occupation','driver3_license','driver3_violations',
      'driver4_name','driver4_dob','driver4_occupation','driver4_license','driver4_violations',
      'v1_year','v1_make','v1_model','v1_assigned_driver','v1_vin','v1_comp_collision','v1_ownership','v1_finance_co',
      'v2_year','v2_make','v2_model','v2_assigned_driver','v2_vin','v2_comp_collision','v2_ownership','v2_finance_co',
      'v3_year','v3_make','v3_model','v3_assigned_driver','v3_vin','v3_comp_collision','v3_ownership','v3_finance_co',
      'v4_year','v4_make','v4_model','v4_assigned_driver','v4_vin','v4_comp_collision','v4_ownership','v4_finance_co',
      'auto_limits','auto_rent_own','auto_medical_carrier','household_count','household_members',
    ],
  },
  {
    title: 'Homeowners Insurance',
    fields: [
      'home_new_purchase','home_closing_date','home_mortgage',
      'home_current_carrier','home_carrier_exp',
      'home_additional_insured','home_additional_insured_dob','home_additional_insured_address',
      'home_llc','home_llc_name','fire_hydrant','home_property_type',
      'home_renting','home_renting_duration','year_built','sq_footage',
      'foundation_type','basement_finished','bedrooms','bathrooms',
      'single_family','num_families','home_garage','roof_type','roof_updates',
      'asbestos_siding','wood_stove','stucco','heat_type','oil_tank','system_updates',
      'solar_panels','solar_count','solar_ownership',
      'pool','pool_type','diving_board','pool_fenced',
      'trampoline','trampoline_fenced',
      'dog_on_property','home_dog_breed','dog_bite_claims',
      'farming','farming_type',
      'home_claims_history','home_claims_detail',
      'security_alarm','alarm_type','business_exposure',
      'renovations','renovation_plans','renovation_budget','renovation_timeframe',
      'flood_quote_interest','elevation_cert','home_property_address',
    ],
  },
  {
    title: 'Flood Insurance',
    fields: [
      'flood_property_address','flood_property_type','flood_foundation',
      'flood_elevation_cert','flood_current_carrier','flood_carrier_exp','flood_coverage_amount',
    ],
  },
  {
    title: 'Business Insurance',
    fields: ['business_name','industry','num_employees','annual_revenue','biz_coverage','years_in_business'],
  },
  {
    title: 'Watercraft Insurance',
    fields: ['vessel_type','vessel_year','vessel_length','vessel_value','marina_stored'],
  },
  {
    title: 'Current Coverage & Preferences',
    fields: ['currently_insured','primary_carrier','shopping_reason','start_date','referral_source','notes'],
  },
];

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */

// Returns true if a field value is considered empty / noise
function isEmpty(val) {
  if (val === null || val === undefined) { return true; }
  const str = String(val).trim();
  if (str === '' || str === '0') { return true; }
  // Skip default-zero numeric fields (dependents, dog_count)
  return false;
}

// Subject line by form name
function subjectFor(formName) {
  const map = {
    'quote-auto':        '🚗 New Auto Insurance Quote Request',
    'quote-homeowners':  '🏠 New Homeowners Quote Request',
    'quote-flood':       '🌊 New Flood Insurance Quote Request',
    'quote-watercraft':  '⚓ New Watercraft Quote Request',
    'quote-request':     '📋 New Multi-Policy Quote Request',
    'contact':           '✉️ New Contact Form Message — Abbey Insurance',
  };
  return map[formName] || `📬 New Form Submission: ${formName}`;
}

// Build a plain-text email body for quote forms
function buildQuoteEmail(formName, data) {
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Unknown';
  const lines = [];

  lines.push('='.repeat(60));
  lines.push(subjectFor(formName).replace(/^[^\s]+\s/, '').toUpperCase());
  lines.push('='.repeat(60));
  lines.push(`Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET`);
  lines.push('');

  for (const section of SECTIONS) {
    const rows = [];
    for (const field of section.fields) {
      if (!(field in data)) { continue; }
      const val = data[field];
      if (isEmpty(val)) { continue; }
      const label = LABELS[field] || field;
      rows.push(`  ${label}: ${val}`);
    }
    if (rows.length === 0) { continue; }
    lines.push('-'.repeat(60));
    lines.push(section.title.toUpperCase());
    lines.push('-'.repeat(60));
    lines.push(...rows);
    lines.push('');
  }

  lines.push('='.repeat(60));
  lines.push(`Reply to: ${data.email || 'not provided'}  |  Call: ${data.phone || 'not provided'}`);
  lines.push('='.repeat(60));

  return { subject: subjectFor(formName), text: lines.join('\n'), name };
}

// Build a plain-text email body for the contact form
function buildContactEmail(data) {
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Unknown';
  const lines = [];
  lines.push('='.repeat(60));
  lines.push('NEW CONTACT MESSAGE — ABBEY INSURANCE');
  lines.push('='.repeat(60));
  lines.push(`From:    ${name}`);
  lines.push(`Email:   ${data.email || 'not provided'}`);
  lines.push(`Phone:   ${data.phone || 'not provided'}`);
  lines.push(`Subject: ${data.subject || 'not provided'}`);
  lines.push('');
  lines.push('MESSAGE:');
  lines.push(data.message || '(no message)');
  lines.push('');
  lines.push('='.repeat(60));
  return {
    subject: `✉️ Contact: ${data.subject || 'New Message'} — ${name}`,
    text: lines.join('\n'),
    name,
  };
}

/* ─────────────────────────────────────────────────────────
   MAIN HANDLER
───────────────────────────────────────────────────────── */
exports.handler = async function (event) {
  // Netlify sends submission-created events as POST with JSON body
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch (err) {
    console.error('Failed to parse event body:', err);
    return { statusCode: 400, body: 'Bad payload' };
  }

  const formName = payload.form_name || '';
  const data = payload.data || {};

  // Only handle known forms
  const knownForms = ['quote-request','quote-auto','quote-homeowners','quote-flood','quote-watercraft','contact'];
  if (!knownForms.includes(formName)) {
    console.log(`Ignoring unknown form: ${formName}`);
    return { statusCode: 200, body: 'Ignored' };
  }

  // Build email content
  const { subject, text, name } =
    formName === 'contact'
      ? buildContactEmail(data)
      : buildQuoteEmail(formName, data);

  // SMTP transport — configure via Netlify environment variables
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const notifyEmail = process.env.NOTIFY_EMAIL || 'reception@abbeyinsnj.com';

  try {
    await transporter.sendMail({
      from:     `"Abbey Insurance Website" <${process.env.SMTP_USER}>`,
      to:       notifyEmail,
      replyTo:  data.email || notifyEmail,
      subject,
      text,
    });
    console.log(`Email sent for form "${formName}" — ${name}`);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('Failed to send email:', err);
    return { statusCode: 500, body: 'Email send failed' };
  }
};
