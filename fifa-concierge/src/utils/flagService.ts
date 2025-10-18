// Use flagcdn.com for high-quality country flags

export const getFlagUrl = (countryCode: string, size: '20' | '40' | '80' | '160' = '160'): string => {
    return `https://flagcdn.com/w${size}/${countryCode.toLowerCase()}.png`;
};

export const countries = {
    USA: { name: 'United States', code: 'us' },
    MEX: { name: 'Mexico', code: 'mx' },
    BRA: { name: 'Brazil', code: 'br' },
    ARG: { name: 'Argentina', code: 'ar' },
    ENG: { name: 'England', code: 'gb-eng' },
    GER: { name: 'Germany', code: 'de' },
    FRA: { name: 'France', code: 'fr' },
    ESP: { name: 'Spain', code: 'es' },
    POR: { name: 'Portugal', code: 'pt' },
    ITA: { name: 'Italy', code: 'it' },
    NED: { name: 'Netherlands', code: 'nl' },
    BEL: { name: 'Belgium', code: 'be' },
    URU: { name: 'Uruguay', code: 'uy' },
    COL: { name: 'Colombia', code: 'co' },
    CAN: { name: 'Canada', code: 'ca' },
    JAP: { name: 'Japan', code: 'jp' },
    KOR: { name: 'South Korea', code: 'kr' },
    AUS: { name: 'Australia', code: 'au' },
    MAR: { name: 'Morocco', code: 'ma' },
    SEN: { name: 'Senegal', code: 'sn' },
    NGA: { name: 'Nigeria', code: 'ng' },
    GHA: { name: 'Ghana', code: 'gh' },
    CRO: { name: 'Croatia', code: 'hr' },
    POL: { name: 'Poland', code: 'pl' },
    SUI: { name: 'Switzerland', code: 'ch' },
    SWE: { name: 'Sweden', code: 'se' },
    DEN: { name: 'Denmark', code: 'dk' },
    CRC: { name: 'Costa Rica', code: 'cr' },
    ECU: { name: 'Ecuador', code: 'ec' },
    CHI: { name: 'Chile', code: 'cl' },
    PER: { name: 'Peru', code: 'pe' },
};

export type CountryCode = keyof typeof countries;

export const getCountryName = (code: CountryCode): string => {
    return countries[code]?.name || code;
};
