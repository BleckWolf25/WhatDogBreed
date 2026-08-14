/**
 * @file resolveFromPayload.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Resolves canonical breed identities from encoded URL substrings, file names, and international breed aliases.
 *
 * @description
 * Inspects sample image URLs and filename tokens against a comprehensive dictionary of international aliases
 * and normalized catalog slugs to match demo dog samples to their registered breed names.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { DOG_BREEDS_DATABASE } from '$lib/data/dogBreeds.server';

// ---------- CONSTANTS

const ALIAS_MAP: Record<string, string[]> = {
  'Alentejo Mastiff': ['rafeiro', 'alentejo', 'rafeirodoalentejo', 'alentejomastiff'],
  'Castro Laboreiro': ['castro', 'laboreiro', 'castrolaboreiro', 'castro_laboreiro'],
  'Estrela Mountain Dog': ['estrela', 'estrelamountain', 'serradaestrela'],
  'Portuguese Sheepdog': ['aires', 'serradeaires', 'portuguesesheepdog'],
  'Barrocal Algarvio': ['barrocal', 'barrocalalgarvio'],
  'Barbado da Terceira': ['barbado', 'barbadodaterceira'],
  'Transmontano Mastiff': ['transmontano', 'gadotransmontano', 'transmontanomastiff'],
  'Azores Cattle Dog': ['filade-sao-miguel', 'filadesaomiguel', 'azorescattledog', 'saomiguel'],
  'Fila da Terceira': ['filadaterceira', 'filaterceira'],
  'Portuguese Podengo': ['podengo', 'portuguesepodengo'],
  'Portuguese Pointer': ['perdigueiro', 'portuguesepointer'],
  'Portuguese Water Dog': ['waterdog', 'portuguesewaterdog', 'agua'],
  'Miniature Pinscher': ['zwergpinscher', 'minpin', 'miniaturepinscher', 'miniature_pinscher'],
  'Giant Spitz': ['grossspitz', 'großspitz', 'giantspitz'],
  'Miniature Spitz': ['kleinspitz', 'miniaturespitz'],
  'German Hunting Terrier': ['jagdterrier', 'jagd_terrier', 'germanhuntingterrier'],
  Dachshund: ['teckel', 'dackel', 'dachshund', 'wienerdog'],
  'Great Dane': ['deutschedogge', 'greatdane', 'germanmastiff'],
  'German Shepherd': [
    'deutscherschäferhund',
    'deutscherschaeferhund',
    'germanshepherd',
    'alsatian'
  ],
  'German Spaniel': ['wachtelhund', 'deutscherwachtelhund', 'germanspaniel'],
  Kromfohrlander: ['kromfohrländer', 'kromi', 'kromfohrlander'],
  Keeshond: ['wolfspitz', 'keeshond'],
  Pomeranian: ['zwergspitz', 'pomeranian'],
  'Small Munsterlander': ['kleinermünsterländer', 'kleinermunsterlander', 'smallmunsterlander'],
  'Large Munsterlander': ['großermünsterländer', 'grossermunsterlander', 'largemunsterlander']
};

// ---------- BREED RESOLVER

export function findBreedFromPayload(payload: string): string | null {
  if (!payload || payload.trim() === '' || payload.startsWith('data:')) return null;

  const lowerPayload = decodeURIComponent(payload.toLowerCase());
  const isUrl = lowerPayload.startsWith('/') || lowerPayload.startsWith('http');
  const searchTarget = isUrl ? lowerPayload : lowerPayload.slice(0, 500);

  // ---------- ALIAS DICTIONARY MATCH
  for (const [canonicalName, aliases] of Object.entries(ALIAS_MAP)) {
    for (const alias of aliases) {
      if (searchTarget.includes(alias)) {
        const matchedObj = DOG_BREEDS_DATABASE.find(
          (b) => b.name.trim().toLowerCase() === canonicalName.trim().toLowerCase()
        );
        if (matchedObj) return matchedObj.name;
      }
    }
  }

  // ---------- NORMALIZED SLUG MATCH
  const candidates: { breed: (typeof DOG_BREEDS_DATABASE)[0]; len: number }[] = [];

  for (const breed of DOG_BREEDS_DATABASE) {
    const nameSlug = breed.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idSlug = breed.id.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (nameSlug.length >= 3 && searchTarget.includes(nameSlug)) {
      candidates.push({ breed, len: nameSlug.length });
    } else if (idSlug.length >= 3 && searchTarget.includes(idSlug)) {
      candidates.push({ breed, len: idSlug.length });
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.len - a.len);
    const first = candidates[0];
    if (first) {
      return first.breed.name;
    }
  }

  return null;
}
