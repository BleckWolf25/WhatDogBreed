/**
 * @file buildOwnerGuidance.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Constructs comprehensive ownership guidance, veterinary watchlists, and lifecycle advice for dog breeds.
 *
 * @description
 * Generates tailored daily care plans, group-based health watchlists, monthly financial expense estimates,
 * life stage puppy/adult notes, training suggestions, and rescue/shelter adoption context for catalog breeds and off-catalog mixes.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { BreedStats, OwnerGuidance } from '$lib/types/scan';

// ---------- CONSTANTS

const GROUP_HEALTH_HINTS: Record<string, string[]> = {
  Herding: [
    'Hip dysplasia - discuss screening with your vet',
    'Eye disorders (CEA, PRA) in some herding lines',
    'MDR1 drug sensitivity in some breeds - ask before medications'
  ],
  Working: [
    'Hip and elbow dysplasia in larger working breeds',
    'Bloat (GDV) risk in deep-chested dogs - discuss feeding practices',
    'Joint wear from high activity - monitor as they age'
  ],
  Sporting: [
    'Hip dysplasia and ear infections (floppy ears)',
    'Exercise-induced collapse in some retriever lines',
    'Skin and coat issues with frequent swimming'
  ],
  Hound: [
    'Bloat risk in deep-chested hounds',
    'Ear infections from long ears',
    'Back issues in long-bodied hounds'
  ],
  Terrier: [
    'Patellar luxation in small terriers',
    'Skin allergies and dermatitis',
    'Dental disease - prioritize tooth care'
  ],
  Toy: [
    'Patellar luxation and tracheal collapse',
    'Dental crowding - regular dental care essential',
    'Hypoglycemia risk in tiny puppies'
  ],
  'Non-Sporting': [
    'Breed-specific conditions vary widely - confirm with your vet',
    'Brachycephalic airway issues in flat-faced types',
    'Skin fold infections in wrinkled breeds'
  ]
};

// ---------- HELPER FUNCTIONS

function sizeCategory(breed: BreedStats): 'small' | 'medium' | 'large' {
  const weightText = breed.weightRange.toLowerCase();
  if (
    weightText.includes('70') ||
    weightText.includes('80') ||
    weightText.includes('90') ||
    weightText.includes('100')
  ) {
    return 'large';
  }
  if (
    weightText.includes('15') ||
    weightText.includes('20') ||
    weightText.includes('25') ||
    breed.group === 'Toy'
  ) {
    return 'small';
  }
  return 'medium';
}

function costEstimates(size: 'small' | 'medium' | 'large') {
  switch (size) {
    case 'small':
      return {
        monthlyEstimate: '$60–$150/month (food, basics, routine care)',
        initialSetup: '$150–$400 for crate, bed, leash, bowls, and first vet visit'
      };
    case 'large':
      return {
        monthlyEstimate: '$120–$280/month (food, grooming, insurance, routine care)',
        initialSetup: '$250–$700 for crate, bed, gear, and first vet visit'
      };
    default:
      return {
        monthlyEstimate: '$80–$200/month (food, grooming, routine care)',
        initialSetup: '$200–$550 for crate, bed, gear, and first vet visit'
      };
  }
}

function exerciseGuidance(breed: BreedStats): string {
  const minutes = breed.energyLevel >= 4 ? '60–90' : breed.energyLevel >= 3 ? '45–60' : '30–45';
  return `Plan ${minutes} minutes of daily activity - walks, play, and mentally engaging tasks. ${breed.group} breeds often thrive with a job or structured training.`;
}

function groomingGuidance(breed: BreedStats): string {
  if (breed.groomingNeeds >= 4) {
    return `Expect frequent brushing (several times weekly) and professional grooming every 6–8 weeks. Check ears and nails regularly.`;
  }
  if (breed.groomingNeeds >= 2) {
    return `Brush 2–3 times weekly, bathe as needed, and maintain nail, ear, and dental hygiene.`;
  }
  return `Low-maintenance coat - weekly brushing, routine nail trims, and regular ear checks are usually enough.`;
}

function buildAdoptabilitySummary(breed: BreedStats, isMixed: boolean): string {
  const parts: string[] = [];

  if (breed.apartmentFriendly === 'No') {
    parts.push('needs space and daily outdoor access');
  } else if (breed.apartmentFriendly === 'Moderate') {
    parts.push('can adapt to apartments with consistent exercise');
  } else {
    parts.push('generally apartment-friendly with daily walks');
  }

  if (breed.goodWithKidsCategory === 'Best in adult-only home') {
    parts.push('may be best in an adult-only home');
  } else if (breed.goodWithKidsCategory === 'Better with older kids') {
    parts.push('better suited to families with older children');
  } else {
    parts.push('often a good fit for family homes');
  }

  if (breed.separationAnxietyRisk === 'High') {
    parts.push('may struggle with long alone time');
  }

  const prefix = isMixed
    ? `Based on this mix's likely ${breed.name} influence, this dog `
    : `A ${breed.name} typically `;

  return `${prefix}${parts.join(', ')}. Match your schedule, housing, and experience before committing - especially with rescue dogs whose history may differ from breed averages.`;
}

// ---------- GUIDANCE GENERATORS

export function summarizeCarePlan(plan: OwnerGuidance['carePlan']): string {
  return `${plan.exercise} ${plan.grooming} ${plan.diet} ${plan.mentalEnrichment}`.slice(0, 280);
}

export function buildOwnerGuidanceFromCatalog(
  primary: BreedStats,
  options: { secondary?: BreedStats | null; isMixed?: boolean } = {}
): OwnerGuidance {
  const { secondary = null, isMixed = false } = options;
  const size = sizeCategory(primary);
  const costs = costEstimates(size);
  const healthHints = GROUP_HEALTH_HINTS[primary.group] ?? GROUP_HEALTH_HINTS['Non-Sporting'] ?? [];

  // ---------- ADULT SIZE CALCULATION
  let estimatedAdultSize = `${primary.weightRange}, ${primary.heightRange} at maturity`;
  if (isMixed && secondary) {
    estimatedAdultSize = `Mix estimate: likely between ${secondary.weightRange} and ${primary.weightRange} depending on which parent traits dominate. Height often falls between ${secondary.heightRange} and ${primary.heightRange}. DNA testing gives the most accurate answer.`;
  }

  // ---------- TRAINABILITY RATING TEXT
  const trainabilityNote =
    primary.trainability >= 4
      ? 'Responds well to positive reinforcement; keep sessions short and fun.'
      : primary.trainability >= 3
        ? 'Benefits from consistent, patient training with high-value rewards.'
        : 'May need extra patience - use short sessions and avoid harsh corrections.';

  return {
    carePlan: {
      exercise: exerciseGuidance(primary),
      grooming: groomingGuidance(primary),
      diet: `Feed a complete diet matched to ${size} breed size and activity level. Discuss portion size with your vet - ${primary.name} types can gain weight if under-exercised.`,
      mentalEnrichment: `Provide puzzle feeders, scent work, obedience games, and socialization. ${primary.temperament.slice(0, 2).join(' and ')} temperaments often enjoy structured challenges.`,
      redFlags: [
        'Sudden lethargy or appetite loss',
        'Persistent limping or stiffness',
        'Excessive itching, hair loss, or skin sores',
        'Aggression or fear that escalates quickly',
        'Bloat symptoms in deep-chested dogs (distended abdomen, retching)'
      ]
    },
    healthWatchlist: [
      ...healthHints,
      `Typical lifespan for ${primary.name}: ${primary.lifespan} - plan for senior care transitions`
    ],
    lifeStageNotes: {
      puppy: `Puppy phase: prioritize socialization (people, dogs, surfaces, sounds), bite inhibition, and crate training. ${primary.name} puppies need frequent naps and short training bursts. Avoid high-impact exercise until growth plates close.`,
      adult: `Adult phase: maintain steady exercise, weight management, and annual wellness exams. ${primary.genderBehaviorSummary.split('.')[0] ?? ''}.`
    },
    estimatedAdultSize,
    trainingTips: [
      trainabilityNote,
      'Socialize early and continue positive exposure throughout life',
      primary.preyDrive !== 'Low'
        ? 'Use a secure leash and work on recall - prey drive may be present'
        : 'Recall training still essential for off-leash safety',
      'Consider group classes or a certified trainer for new adopters'
    ],
    ownershipCosts: {
      ...costs,
      notes:
        'Budget for pet insurance or an emergency fund. Rescue dogs may need initial vet work (vaccines, spay/neuter, dental).'
    },
    adoptionContext: `Just adopted? Give a decompression period of 3–4 weeks before judging personality. Schedule a vet check within the first week, gather medical history if available, and use a consistent routine. ${primary.name} mixes are common in shelters - love and patience matter as much as breed labels.`,
    adoptabilitySummary: buildAdoptabilitySummary(primary, isMixed)
  };
}

export function buildOffCatalogOwnerGuidance(
  breedName: string,
  options: { isMixed?: boolean; mixComponents?: string[] } = {}
): OwnerGuidance {
  const { isMixed = false, mixComponents = [] } = options;
  const mixLabel = mixComponents.length > 0 ? mixComponents.join(' / ') : breedName;

  return {
    carePlan: {
      exercise: `Provide daily walks and active play matched to body size and energy. For ${breedName}, start with 45–60 minutes and adjust based on behavior - panting, restlessness, or destructive chewing often signal under-stimulation.`,
      grooming:
        'Brush regularly based on coat length, check ears weekly, trim nails monthly, and establish dental care early.',
      diet: 'Feed a complete commercial or vet-approved diet sized for the dog’s current weight and body condition. Avoid overfeeding - mixed breeds vary widely in metabolism.',
      mentalEnrichment:
        'Use puzzle toys, training sessions, sniff walks, and safe socialization. Mental work tires dogs as effectively as physical exercise.',
      redFlags: [
        'Sudden behavior or appetite changes',
        'Persistent lameness or swelling',
        'Difficulty breathing or excessive panting at rest',
        'Signs of pain when touched',
        'Severe anxiety or inability to settle after several weeks'
      ]
    },
    healthWatchlist: [
      `${breedName} is not in our catalog - ask your vet about breed-specific screening`,
      'Baseline blood work and fecal exam recommended after adoption',
      'Discuss spay/neuter timing, vaccine schedule, and parasite prevention',
      'Mixed breeds can inherit conditions from any lineage - family history helps if known'
    ],
    lifeStageNotes: {
      puppy:
        'Puppies need socialization windows before 16 weeks - expose safely to people, sounds, and surfaces. Keep exercise low-impact until fully grown.',
      adult:
        'Adults benefit from consistent routines, annual wellness exams, dental care, and weight monitoring throughout life.'
    },
    estimatedAdultSize: isMixed
      ? `Adult size for this mix (${mixLabel}) depends on parent breeds. Track weight monthly as a puppy; paw size and parent info offer clues but DNA testing is most accurate.`
      : `Research ${breedName} breed standards for typical adult size, or ask your vet to estimate from current age and weight.`,
    trainingTips: [
      'Use positive reinforcement - treats, praise, and play as rewards',
      'Keep sessions 5–10 minutes for puppies, longer for adults in multiple bursts',
      'If adopted from a shelter, allow time to adjust before intensive training',
      'Consider a force-free trainer if behavior challenges appear'
    ],
    ownershipCosts: {
      monthlyEstimate: '$80–$220/month depending on size, food quality, grooming, and insurance',
      initialSetup: '$200–$600 for essentials plus an initial vet visit',
      notes:
        'Rescue adoption fees are only the start - budget for unexpected medical costs in the first year.'
    },
    adoptionContext: `Shelter and rescue dogs labeled "${breedName}" are often visual guesses. Focus on the individual dog’s behavior, energy, and health rather than the label. A decompression period, vet visit, and slow introductions to home members set adopters up for success.`,
    adoptabilitySummary: `This dog appears to be ${isMixed ? `a mix involving ${mixLabel}` : breedName}. Ask whether your home, daily schedule, and budget fit an active, social dog. With rescues, meet the individual - not just the breed name - before deciding.`
  };
}
