export interface AdmInfo {
    TERYT: string;
    name: string;
    area: number;
    population: number;
    link: string;
    coa_link: string;
    type: string;
    has_one_child: boolean;
    only_child: boolean;
    subtypeDigit?: number;
}