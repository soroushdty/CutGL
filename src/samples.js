// Sample projects offered under Project > Open. All three guidelines are invented for the
// demonstration; none of the text is clinical guidance. Each sample names the guideline file,
// its content, and a build(h) function that fills in the GEM tree:
//   h.at(node, 'A/B')        first descendant along that path of element names
//   h.put(node, quote, opts) set the element text to the quote and link it to that passage
//                            opts: {text, source, noLink, nth} (nth = which occurrence, from 0)
//   h.another(node)          "Create subtree": a second blank copy of the element
//   h.logic(ifPart, thenPart)
const SAMPLE_NOTE = 'Example guideline. The text is invented to demonstrate GEM Cutter and is not clinical guidance.';

const SAMPLES = [
  {
    id: 'hand-hygiene',
    name: 'sample_hand_hygiene',
    label: 'Hand hygiene',
    kind: 'plain text',
    file: 'hand_hygiene.txt',
    text: [
      'EXAMPLE GUIDELINE',
      SAMPLE_NOTE,
      '',
      'Hand Hygiene in Outpatient Clinics',
      'Released March 2026 by the Example Clinic Quality Committee',
      '',
      'Purpose',
      'This guideline describes when and how clinic staff should clean their hands in order to reduce the spread of infection between patients.',
      '',
      'Intended users',
      'Physicians, nurses and medical assistants working in outpatient clinics.',
      '',
      'Recommendations',
      '1. Clinic staff should clean their hands with an alcohol-based hand rub before and after every patient contact. (Strong recommendation; moderate-quality evidence)',
      '',
      '2. If hands are visibly soiled, staff should wash them with soap and water for at least 20 seconds instead of using hand rub. (Strong recommendation; low-quality evidence)',
      '',
    ].join('\n'),
    build(h) {
      const root = h.root;
      h.put(h.at(root, 'Identity/GuidelineTitle'), 'Hand Hygiene in Outpatient Clinics');
      h.put(h.at(root, 'Identity/ReleaseDate'), 'March 2026');
      h.put(h.at(root, 'Developer/DeveloperName'), 'Example Clinic Quality Committee');
      h.put(h.at(root, 'Purpose/MainFocus'), 'This guideline describes when and how clinic staff should clean their hands in order to reduce the spread of infection between patients.');
      h.put(h.at(root, 'IntendedAudience/Users'), 'Physicians, nurses and medical assistants working in outpatient clinics.');
      const r1 = h.at(root, 'KnowledgeComponents/Recommendation');
      h.put(r1, 'Clinic staff should clean their hands with an alcohol-based hand rub before and after every patient contact.');
      const imp = h.at(r1, 'Imperative');
      h.put(h.at(imp, 'Directive'), 'clean their hands with an alcohol-based hand rub before and after every patient contact');
      h.put(h.at(imp, 'Directive/DirectiveActor'), 'Clinic staff', { nth: 1 });
      h.put(h.at(imp, 'Directive/DirectiveType'), '', { text: 'perform', noLink: true });
      h.put(h.at(imp, 'RecommendationStrength'), 'Strong recommendation');
      h.put(h.at(imp, 'EvidenceQuality'), 'moderate-quality evidence');
      const r2 = h.another(r1);
      h.put(r2, 'If hands are visibly soiled, staff should wash them with soap and water for at least 20 seconds instead of using hand rub.');
      const cond = h.at(r2, 'Conditional');
      h.put(h.at(cond, 'DecisionVariable'), 'hands are visibly soiled');
      h.put(h.at(cond, 'DecisionVariable/Value'), '', { text: 'true', source: 'inferred', noLink: true });
      h.put(h.at(cond, 'Action'), 'wash them with soap and water for at least 20 seconds');
      h.put(h.at(cond, 'Action/ActionType'), '', { text: 'perform', noLink: true });
      h.put(h.at(cond, 'RecommendationStrength'), 'Strong recommendation', { nth: 1 });
      h.put(h.at(cond, 'EvidenceQuality'), 'low-quality evidence');
      h.put(h.at(cond, 'Logic'), '', { text: h.logic('hands are visibly soiled is [true]', 'wash them with soap and water for at least 20 seconds'), source: 'inferred', noLink: true });
    },
  },
  {
    id: 'inhaler-review',
    name: 'sample_inhaler_review',
    label: 'Inhaler technique review',
    kind: 'HTML',
    file: 'inhaler_review.html',
    text: [
      '<!doctype html>',
      '<html lang="en"><head><meta charset="utf-8"><title>Inhaler Technique Review (example)</title></head><body>',
      '<h1>Inhaler Technique Review for Adults With Asthma</h1>',
      '<p><em>' + SAMPLE_NOTE + '</em></p>',
      '<p>Version 2, released June 2026 by the Example Respiratory Care Group.</p>',
      '<h2>Scope</h2>',
      '<p>This guideline applies to adults aged 18 years or older with a diagnosis of asthma who use an inhaler. It does not apply to people who use a nebuliser only.</p>',
      '<h2>How the guideline was developed</h2>',
      '<p>A panel of two nurses, one pharmacist and one physician reviewed studies published between 2015 and 2025 and agreed the recommendations by consensus.</p>',
      '<h2>Recommendations</h2>',
      '<ol>',
      '<li>A nurse or pharmacist should watch the patient use their inhaler at every asthma review. <strong>(Strong recommendation, moderate-quality evidence)</strong></li>',
      '<li>If the patient makes an error in technique, the clinician should demonstrate the correct technique and ask the patient to repeat it. <strong>(Strong recommendation, low-quality evidence)</strong></li>',
      '<li>If the patient cannot use a pressurised metered-dose inhaler correctly after teaching, the clinician should offer a spacer. <strong>(Conditional recommendation, very low-quality evidence)</strong></li>',
      '</ol>',
      '<h2>Definitions</h2>',
      '<table>',
      '<tr><th>Term</th><th>Meaning</th></tr>',
      '<tr><td>Spacer</td><td>A holding chamber attached to a metered-dose inhaler.</td></tr>',
      '<tr><td>Asthma review</td><td>A planned visit to assess control, treatment and technique.</td></tr>',
      '</table>',
      '</body></html>',
      '',
    ].join('\n'),
    build(h) {
      const root = h.root;
      h.put(h.at(root, 'Identity/GuidelineTitle'), 'Inhaler Technique Review for Adults With Asthma');
      h.put(h.at(root, 'Identity/ReleaseDate'), 'June 2026');
      h.put(h.at(root, 'Identity/Status'), 'Version 2');
      h.put(h.at(root, 'Developer/DeveloperName'), 'Example Respiratory Care Group');
      h.put(h.at(root, 'Developer/CommitteeName/CommitteeExpertise'), 'two nurses, one pharmacist and one physician');
      h.put(h.at(root, 'MethodOfDevelopment/DescriptionEvidenceCollection/EvidenceTimePeriod'), 'between 2015 and 2025');
      h.put(h.at(root, 'MethodOfDevelopment/MethodsToReachJudgment'), 'agreed the recommendations by consensus');
      h.put(h.at(root, 'TargetPopulation/Eligibility/InclusionCriterion'), 'adults aged 18 years or older with a diagnosis of asthma who use an inhaler');
      h.put(h.at(root, 'TargetPopulation/Eligibility/ExclusionCriterion'), 'people who use a nebuliser only');
      const kc = h.at(root, 'KnowledgeComponents');
      const r1 = h.at(kc, 'Recommendation');
      h.put(r1, 'A nurse or pharmacist should watch the patient use their inhaler at every asthma review.');
      const imp = h.at(r1, 'Imperative');
      h.put(h.at(imp, 'Directive'), 'watch the patient use their inhaler at every asthma review');
      h.put(h.at(imp, 'Directive/DirectiveActor'), 'A nurse or pharmacist');
      h.put(h.at(imp, 'Directive/DirectiveType'), '', { text: 'monitor', noLink: true });
      h.put(h.at(imp, 'RecommendationStrength'), 'Strong recommendation');
      h.put(h.at(imp, 'EvidenceQuality'), 'moderate-quality evidence');
      const r2 = h.another(r1);
      h.put(r2, 'If the patient makes an error in technique, the clinician should demonstrate the correct technique and ask the patient to repeat it.');
      const c2 = h.at(r2, 'Conditional');
      h.put(h.at(c2, 'DecisionVariable'), 'the patient makes an error in technique');
      h.put(h.at(c2, 'DecisionVariable/Value'), '', { text: 'true', source: 'inferred', noLink: true });
      h.put(h.at(c2, 'Action'), 'demonstrate the correct technique and ask the patient to repeat it');
      h.put(h.at(c2, 'Action/ActionActor'), 'the clinician');
      h.put(h.at(c2, 'Action/ActionType'), '', { text: 'educate/counsel', noLink: true });
      h.put(h.at(c2, 'RecommendationStrength'), 'Strong recommendation', { nth: 1 });
      h.put(h.at(c2, 'Logic'), '', { text: h.logic('the patient makes an error in technique is [true]', 'demonstrate the correct technique and ask the patient to repeat it'), source: 'inferred', noLink: true });
      const r3 = h.another(r2);
      h.put(r3, 'If the patient cannot use a pressurised metered-dose inhaler correctly after teaching, the clinician should offer a spacer.');
      const c3 = h.at(r3, 'Conditional');
      h.put(h.at(c3, 'DecisionVariable'), 'the patient cannot use a pressurised metered-dose inhaler correctly after teaching');
      h.put(h.at(c3, 'Action'), 'offer a spacer');
      h.put(h.at(c3, 'Action/ActionType'), '', { text: 'prescribe', noLink: true });
      h.put(h.at(c3, 'RecommendationStrength'), 'Conditional recommendation');
      h.put(h.at(c3, 'EvidenceQuality'), 'very low-quality evidence');
      const d1 = h.at(kc, 'Definition');
      h.put(h.at(d1, 'Term'), 'Spacer', { nth: 1 });
      h.put(h.at(d1, 'Term/TermMeaning'), 'A holding chamber attached to a metered-dose inhaler.');
      const d2 = h.another(d1);
      h.put(h.at(d2, 'Term'), 'Asthma review', { nth: 1 });
      h.put(h.at(d2, 'Term/TermMeaning'), 'A planned visit to assess control, treatment and technique.');
    },
  },
  {
    id: 'blood-pressure',
    name: 'sample_blood_pressure',
    label: 'Blood pressure measurement',
    kind: 'PDF, 2 pages',
    file: 'blood_pressure.pdf',
    base64: typeof SAMPLE_PDF_B64 === 'string' ? SAMPLE_PDF_B64 : '',
    build(h) {
      const root = h.root;
      h.put(h.at(root, 'Identity/GuidelineTitle'), 'Measuring Blood Pressure at Clinic Visits');
      h.put(h.at(root, 'Identity/ReleaseDate'), 'January 2026');
      h.put(h.at(root, 'Developer/DeveloperName'), 'Example Primary Care Network');
      h.put(h.at(root, 'Purpose/MainFocus'), 'This guideline sets out how blood pressure should be measured in adult primary care clinics so that readings are comparable between visits and between clinicians.');
      h.put(h.at(root, 'IntendedAudience/Users'), 'Medical assistants, nurses and physicians');
      h.put(h.at(root, 'IntendedAudience/CareSetting'), 'primary care clinics', { nth: 1 });
      h.put(h.at(root, 'TargetPopulation/Eligibility/InclusionCriterion'), 'Adults aged 18 years or older attending a routine clinic visit.');
      h.put(h.at(root, 'TargetPopulation/Eligibility/ExclusionCriterion'), 'Pregnant women');
      h.put(h.at(root, 'MethodOfDevelopment/DescriptionEvidenceCollection/EvidenceTimePeriod'), 'from 2010 to 2025');
      h.put(h.at(root, 'MethodOfDevelopment/RatingScheme/RecommendationStrengthRatingScheme'), 'graded each recommendation as strong or conditional');
      h.put(h.at(root, 'RevisionPlan/ScheduledReview'), 'This guideline will be reviewed every three years, or sooner if new evidence appears.');
      const r1 = h.at(root, 'KnowledgeComponents/Recommendation');
      h.put(r1, 'Measure blood pressure after the patient has been seated quietly for at least five minutes.');
      const i1 = h.at(r1, 'Imperative');
      h.put(h.at(i1, 'Directive'), 'Measure blood pressure after the patient has been seated quietly for at least five minutes');
      h.put(h.at(i1, 'Directive/DirectiveType'), '', { text: 'test/examine', noLink: true });
      h.put(h.at(i1, 'RecommendationStrength'), 'Strong recommendation');
      h.put(h.at(i1, 'EvidenceQuality'), 'moderate-quality evidence');
      const r2 = h.another(r1);
      h.put(r2, 'Use a validated automated device with a cuff sized to the upper arm of the patient.');
      const i2 = h.at(r2, 'Imperative');
      h.put(h.at(i2, 'Directive'), 'Use a validated automated device with a cuff sized to the upper arm of the patient');
      h.put(h.at(i2, 'RecommendationStrength'), 'Strong recommendation', { nth: 1 });
      h.put(h.at(i2, 'EvidenceQuality'), 'high-quality evidence');
      const r3 = h.another(r2);
      h.put(r3, 'If the first reading is 140/90 mm Hg or higher, take two further readings one minute apart and record the average of the last two.');
      const c3 = h.at(r3, 'Conditional');
      h.put(h.at(c3, 'DecisionVariable'), 'the first reading is 140/90 mm Hg or higher');
      h.put(h.at(c3, 'DecisionVariable/Value'), '', { text: 'true', source: 'inferred', noLink: true });
      h.put(h.at(c3, 'Action'), 'take two further readings one minute apart and record the average of the last two');
      h.put(h.at(c3, 'Action/ActionType'), '', { text: 'test/examine', noLink: true });
      h.put(h.at(c3, 'RecommendationStrength'), 'Conditional recommendation');
      h.put(h.at(c3, 'EvidenceQuality'), 'low-quality evidence');
      h.put(h.at(c3, 'Logic'), '', { text: h.logic('the first reading is 140/90 mm Hg or higher is [true]', 'take two further readings one minute apart and record the average of the last two'), source: 'inferred', noLink: true });
    },
  },
];
