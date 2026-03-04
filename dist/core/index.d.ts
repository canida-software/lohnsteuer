import Decimal from 'decimal.js';

/**
 * Type definitions for the German Wage Tax (Lohnsteuer) PAP algorithm.
 *
 * Extracted from the official BMF Programmablaufplan (PAP) XML pseudocode.
 * All parameter names match the PAP exactly.
 *
 * Monetary values at the public API boundary are in Cent (integers).
 * Internal calculations use Decimal (decimal.js) for arbitrary-precision arithmetic.
 */

/**
 * Input parameters for Lohnsteuer calculation.
 *
 * All fields are optional -- omitted fields use their PAP-defined defaults.
 * Monetary values are in **Cent** (integers). Rates are percentages.
 * The PAP XML type annotations (int, BigDecimal, double) are noted in JSDoc;
 * at the public API boundary everything is `number`.
 */
interface LohnsteuerInputs {
    /**
     * 1, wenn die Anwendung des Faktorverfahrens gewählt wurden (nur in Steuerklasse IV).
     * PAP type: int. Default: 1
     */
    af?: number;
    /**
     * Auf die Vollendung des 64. Lebensjahres folgendes
     * Kalenderjahr (erforderlich, wenn ALTER1=1).
     * PAP type: int. Default: 0
     */
    AJAHR?: number;
    /**
     * 1, wenn das 64. Lebensjahr zu Beginn des Kalenderjahres vollendet wurde, in dem
     * der Lohnzahlungszeitraum endet (§ 24a EStG), sonst = 0.
     * PAP type: int. Default: 0
     */
    ALTER1?: number;
    /**
     * Merker für die Vorsorgepauschale:
     * 0 = der Arbeitnehmer ist in der Arbeitslosenversicherung pflichtversichert;
     *     es gilt die allgemeine Beitragsbemessungsgrenze.
     * 1 = wenn nicht 0.
     * PAP type: int. Default: 0
     */
    ALV?: number;
    /**
     * Eingetragener Faktor mit drei Nachkommastellen.
     * PAP type: double. Default: 1.0
     */
    f?: number;
    /**
     * Jahresfreibetrag für die Ermittlung der Lohnsteuer für die sonstigen Bezüge
     * sowie für Vermögensbeteiligungen nach § 19a Absatz 1 und 4 EStG nach Maßgabe der
     * elektronischen Lohnsteuerabzugsmerkmale nach § 39e EStG oder der Eintragung
     * auf der Bescheinigung für den Lohnsteuerabzug in Cent (ggf. 0).
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    JFREIB?: number;
    /**
     * Jahreshinzurechnungsbetrag für die Ermittlung der Lohnsteuer für die sonstigen Bezüge
     * sowie für Vermögensbeteiligungen nach § 19a Absatz 1 und 4 EStG nach Maßgabe der
     * elektronischen Lohnsteuerabzugsmerkmale nach § 39e EStG oder der Eintragung auf der
     * Bescheinigung für den Lohnsteuerabzug in Cent (ggf. 0).
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    JHINZU?: number;
    /**
     * Voraussichtlicher Jahresarbeitslohn ohne sonstige Bezüge (d.h. auch ohne
     * die zu besteuernden Vorteile bei Vermögensbeteiligungen, § 19a Absatz 4 EStG) in Cent.
     * Erforderlich bei Eingaben zu sonstigen Bezügen (Feld SONSTB).
     * Sind in einem vorangegangenen Abrechnungszeitraum bereits sonstige Bezüge gezahlt worden,
     * so sind sie dem voraussichtlichen Jahresarbeitslohn hinzuzurechnen.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    JRE4?: number;
    /**
     * In JRE4 enthaltene Entschädigungen nach § 24 Nummer 1 EStG und zu besteuernde
     * Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 4 EStG) in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    JRE4ENT?: number;
    /**
     * In JRE4 enthaltene Versorgungsbezüge in Cent (ggf. 0).
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    JVBEZ?: number;
    /**
     * Merker für die Vorsorgepauschale:
     * 0 = der Arbeitnehmer ist in der gesetzlichen Rentenversicherung oder einer
     *     berufsständischen Versorgungseinrichtung pflichtversichert oder bei Befreiung
     *     von der Versicherungspflicht freiwillig versichert; es gilt die allgemeine
     *     Beitragsbemessungsgrenze.
     * 1 = wenn nicht 0.
     * PAP type: int. Default: 0
     */
    KRV?: number;
    /**
     * Kassenindividueller Zusatzbeitragssatz bei einem gesetzlich krankenversicherten
     * Arbeitnehmer in Prozent (bspw. 2.50 für 2,50 %) mit 2 Dezimalstellen.
     * Es ist der volle Zusatzbeitragssatz anzugeben. Die Aufteilung in Arbeitnehmer-
     * und Arbeitgeberanteil erfolgt im Programmablauf.
     * PAP type: BigDecimal (percentage). Default: 0
     */
    KVZ?: number;
    /**
     * Lohnzahlungszeitraum:
     * 1 = Jahr, 2 = Monat, 3 = Woche, 4 = Tag.
     * PAP type: int. Default: 1
     */
    LZZ?: number;
    /**
     * Der als elektronisches Lohnsteuerabzugsmerkmal für den Arbeitgeber nach § 39e EStG
     * festgestellte oder in der Bescheinigung für den Lohnsteuerabzug eingetragene
     * Freibetrag für den Lohnzahlungszeitraum in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    LZZFREIB?: number;
    /**
     * Der als elektronisches Lohnsteuerabzugsmerkmal für den Arbeitgeber nach § 39e EStG
     * festgestellte oder in der Bescheinigung für den Lohnsteuerabzug eingetragene
     * Hinzurechnungsbetrag für den Lohnzahlungszeitraum in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    LZZHINZU?: number;
    /**
     * Nicht zu besteuernde Vorteile bei Vermögensbeteiligungen
     * (§ 19a Absatz 1 Satz 4 EStG) in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    MBV?: number;
    /**
     * Dem Arbeitgeber mitgeteilte Beiträge des Arbeitnehmers für eine private
     * Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des § 10 Absatz 1 Nummer 3 EStG
     * in Cent; der Wert ist unabhängig vom Lohnzahlungszeitraum immer als Monatsbetrag
     * anzugeben.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    PKPV?: number;
    /**
     * Arbeitgeberzuschuss für eine private Basiskranken- bzw. Pflege-Pflichtversicherung
     * im Sinne des § 10 Absatz 1 Nummer 3 EStG in Cent; der Wert ist unabhängig vom
     * Lohnzahlungszeitraum immer als Monatsbetrag anzugeben.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    PKPVAGZ?: number;
    /**
     * Krankenversicherung:
     * 0 = gesetzlich krankenversicherte Arbeitnehmer.
     * 1 = ausschließlich privat krankenversicherte Arbeitnehmer.
     * PAP type: int. Default: 0
     */
    PKV?: number;
    /**
     * Zahl der beim Arbeitnehmer zu berücksichtigenden Beitragsabschläge in der sozialen
     * Pflegeversicherung bei mehr als einem Kind:
     * 0 = kein Abschlag,
     * 1 = Beitragsabschlag für das 2. Kind,
     * 2 = Beitragsabschläge für das 2. und 3. Kind,
     * 3 = Beitragsabschläge für 2. bis 4. Kinder,
     * 4 = Beitragsabschläge für 2. bis 5. oder mehr Kinder.
     * PAP type: BigDecimal (integer at API boundary). Default: 0
     */
    PVA?: number;
    /**
     * 1, wenn bei der sozialen Pflegeversicherung die Besonderheiten in Sachsen
     * zu berücksichtigen sind bzw. zu berücksichtigen wären.
     * PAP type: int. Default: 0
     */
    PVS?: number;
    /**
     * 1, wenn der Arbeitnehmer den Zuschlag zur sozialen Pflegeversicherung
     * zu zahlen hat.
     * PAP type: int. Default: 0
     */
    PVZ?: number;
    /**
     * Religionsgemeinschaft des Arbeitnehmers lt. elektronischer Lohnsteuerabzugsmerkmale
     * oder der Bescheinigung für den Lohnsteuerabzug (bei keiner Religionszugehörigkeit = 0).
     * PAP type: int. No default specified.
     */
    R?: number;
    /**
     * Steuerpflichtiger Arbeitslohn für den Lohnzahlungszeitraum vor Berücksichtigung des
     * Versorgungsfreibetrags und des Zuschlags zum Versorgungsfreibetrag, des
     * Altersentlastungsbetrags und des als elektronisches Lohnsteuerabzugsmerkmal
     * festgestellten oder in der Bescheinigung für den Lohnsteuerabzug eingetragenen
     * Freibetrags bzw. Hinzurechnungsbetrags in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    RE4?: number;
    /**
     * Sonstige Bezüge einschließlich zu besteuernde Vorteile bei Vermögensbeteiligungen
     * und Sterbegeld bei Versorgungsbezügen sowie Kapitalauszahlungen/Abfindungen, in Cent
     * (ggf. 0).
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    SONSTB?: number;
    /**
     * In SONSTB enthaltene Entschädigungen nach § 24 Nummer 1 EStG sowie zu besteuernde
     * Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 4 EStG), in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    SONSTENT?: number;
    /**
     * Sterbegeld bei Versorgungsbezügen sowie Kapitalauszahlungen/Abfindungen
     * (in SONSTB enthalten), in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    STERBE?: number;
    /**
     * Steuerklasse:
     * 1 = I, 2 = II, 3 = III, 4 = IV, 5 = V, 6 = VI.
     * PAP type: int. Default: 1
     */
    STKL?: number;
    /**
     * In RE4 enthaltene Versorgungsbezüge in Cent (ggf. 0) ggf. unter Berücksichtigung
     * einer geänderten Bemessungsgrundlage nach § 19 Absatz 2 Satz 10 und 11 EStG.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    VBEZ?: number;
    /**
     * Versorgungsbezug im Januar 2005 bzw. für den ersten vollen Monat, wenn der
     * Versorgungsbezug erstmalig nach Januar 2005 gewährt wurde, in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    VBEZM?: number;
    /**
     * Voraussichtliche Sonderzahlungen von Versorgungsbezügen im Kalenderjahr des
     * Versorgungsbeginns bei Versorgungsempfängern ohne Sterbegeld,
     * Kapitalauszahlungen/Abfindungen in Cent.
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    VBEZS?: number;
    /**
     * In SONSTB enthaltene Versorgungsbezüge einschließlich Sterbegeld in Cent (ggf. 0).
     * PAP type: BigDecimal (Cent integer at API boundary). Default: 0
     */
    VBS?: number;
    /**
     * Jahr, in dem der Versorgungsbezug erstmalig gewährt wurde; werden mehrere
     * Versorgungsbezüge gezahlt, wird aus Vereinfachungsgründen für die Berechnung
     * das Jahr des ältesten erstmaligen Bezugs herangezogen; auf die Möglichkeit der
     * getrennten Abrechnung verschiedenartiger Bezüge (§ 39e Absatz 5a EStG) wird
     * im Übrigen verwiesen.
     * PAP type: int. Default: 0
     */
    VJAHR?: number;
    /**
     * Zahl der Freibeträge für Kinder (eine Dezimalstelle, nur bei Steuerklassen
     * I, II, III und IV).
     * PAP type: BigDecimal (number at API boundary). Default: 0
     */
    ZKF?: number;
    /**
     * Zahl der Monate, für die Versorgungsbezüge gezahlt werden
     * (nur erforderlich bei Jahresberechnung, LZZ = 1).
     * PAP type: int. Default: 0
     */
    ZMVB?: number;
}
/**
 * Output parameters from Lohnsteuer calculation.
 *
 * All values are in **Cent** (integers). STANDARD outputs are listed first,
 * then DBA (Doppelbesteuerungsabkommen / tax treaty) outputs.
 */
interface LohnsteuerOutputs {
    /** Bemessungsgrundlage für die Kirchenlohnsteuer in Cent. */
    BK: number;
    /**
     * Bemessungsgrundlage der sonstigen Bezüge für die Kirchenlohnsteuer in Cent.
     * Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei
     * Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern BK
     * (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen
     * im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
     */
    BKS: number;
    /** Für den Lohnzahlungszeitraum einzubehaltende Lohnsteuer in Cent. */
    LSTLZZ: number;
    /** Für den Lohnzahlungszeitraum einzubehaltender Solidaritätszuschlag in Cent. */
    SOLZLZZ: number;
    /**
     * Solidaritätszuschlag für sonstige Bezüge in Cent.
     * Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei
     * Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren,
     * mindern SOLZLZZ (maximal bis 0).
     */
    SOLZS: number;
    /**
     * Lohnsteuer für sonstige Bezüge in Cent.
     * Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei
     * Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren,
     * mindern LSTLZZ (maximal bis 0).
     */
    STS: number;
    /** Verbrauchter Freibetrag bei Berechnung des laufenden Arbeitslohns, in Cent. */
    VFRB: number;
    /** Verbrauchter Freibetrag bei Berechnung des voraussichtlichen Jahresarbeitslohns, in Cent. */
    VFRBS1: number;
    /** Verbrauchter Freibetrag bei Berechnung der sonstigen Bezüge, in Cent. */
    VFRBS2: number;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei
     * verfügbares ZVE über dem Grundfreibetrag bei der Berechnung des laufenden
     * Arbeitslohns, in Cent.
     */
    WVFRB: number;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei
     * verfügbares ZVE über dem Grundfreibetrag bei der Berechnung des voraussichtlichen
     * Jahresarbeitslohns, in Cent.
     */
    WVFRBO: number;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei
     * verfügbares ZVE über dem Grundfreibetrag bei der Berechnung der sonstigen Bezüge,
     * in Cent.
     */
    WVFRBM: number;
}
/**
 * Internal calculation fields used by the PAP algorithm.
 *
 * All values use Decimal (decimal.js) for arbitrary-precision arithmetic.
 * These are never exposed at the public API boundary.
 */
interface LohnsteuerInternals {
    /** Altersentlastungsbetrag in Euro, Cent (2 Dezimalstellen). */
    ALTE: Decimal;
    /** Arbeitnehmer-Pauschbetrag / Werbungskosten-Pauschbetrag in Euro. */
    ANP: Decimal;
    /** Auf den Lohnzahlungszeitraum entfallender Anteil von Jahreswerten auf ganze Cent abgerundet. */
    ANTEIL1: Decimal;
    /** Beitragssatz des Arbeitnehmers zur Arbeitslosenversicherung (4 Dezimalstellen). */
    AVSATZAN: Decimal;
    /** Beitragsbemessungsgrenze in der gesetzlichen Krankenversicherung und der sozialen Pflegeversicherung in Euro. */
    BBGKVPV: Decimal;
    /** Allgemeine Beitragsbemessungsgrenze in der allgemeinen Rentenversicherung und Arbeitslosenversicherung in Euro. */
    BBGRVALV: Decimal;
    /** Bemessungsgrundlage für Altersentlastungsbetrag in Euro, Cent (2 Dezimalstellen). */
    BMG: Decimal;
    /** Differenz zwischen ST1 und ST2 in Euro. */
    DIFF: Decimal;
    /** Entlastungsbetrag für Alleinerziehende in Euro. */
    EFA: Decimal;
    /** Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen). */
    FVB: Decimal;
    /** Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen) für die Berechnung der Lohnsteuer beim sonstigen Bezug. */
    FVBSO: Decimal;
    /** Zuschlag zum Versorgungsfreibetrag in Euro. */
    FVBZ: Decimal;
    /** Zuschlag zum Versorgungsfreibetrag in Euro für die Berechnung der Lohnsteuer beim sonstigen Bezug. */
    FVBZSO: Decimal;
    /** Grundfreibetrag in Euro. */
    GFB: Decimal;
    /** Maximaler Altersentlastungsbetrag in Euro. */
    HBALTE: Decimal;
    /** Maßgeblicher maximaler Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen). */
    HFVB: Decimal;
    /** Maßgeblicher maximaler Zuschlag zum Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen). */
    HFVBZ: Decimal;
    /** Maßgeblicher maximaler Zuschlag zum Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen) für die Berechnung der Lohnsteuer für den sonstigen Bezug. */
    HFVBZSO: Decimal;
    /** Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro. */
    HOCH: Decimal;
    /** Nummer der Tabellenwerte für Versorgungsparameter. */
    J: number;
    /** Jahressteuer nach § 51a EStG, aus der Solidaritätszuschlag und Bemessungsgrundlage für die Kirchenlohnsteuer ermittelt werden, in Euro. */
    JBMG: Decimal;
    /** Auf einen Jahreslohn hochgerechneter LZZFREIB in Euro, Cent (2 Dezimalstellen). */
    JLFREIB: Decimal;
    /** Auf einen Jahreslohn hochgerechnete LZZHINZU in Euro, Cent (2 Dezimalstellen). */
    JLHINZU: Decimal;
    /** Jahreswert, dessen Anteil für einen Lohnzahlungszeitraum in UPANTEIL errechnet werden soll, in Cent. */
    JW: Decimal;
    /** Nummer der Tabellenwerte für Parameter bei Altersentlastungsbetrag. */
    K: number;
    /** Summe der Freibeträge für Kinder in Euro. */
    KFB: Decimal;
    /** Beitragssatz des Arbeitnehmers zur Krankenversicherung (5 Dezimalstellen). */
    KVSATZAN: Decimal;
    /** Kennzahl für die Einkommensteuer-Tabellenart: 1 = Grundtarif, 2 = Splittingverfahren. */
    KZTAB: number;
    /** Jahreslohnsteuer in Euro. */
    LSTJAHR: Decimal;
    /** Zwischenfeld der Jahreslohnsteuer in Cent (Lohnsteuer ohne sonstige Bezüge). */
    LSTOSO: Decimal;
    /** Zwischenfeld der Jahreslohnsteuer in Cent (Lohnsteuer mit sonstigen Bezügen). */
    LSTSO: Decimal;
    /** Mindeststeuer für die Steuerklassen V und VI in Euro. */
    MIST: Decimal;
    /** Auf einen Jahreswert hochgerechneter Arbeitgeberzuschuss für eine private Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des § 10 Absatz 1 Nummer 3 EStG in Euro, Cent (2 Dezimalstellen). */
    PKPVAGZJ: Decimal;
    /** Beitragssatz des Arbeitnehmers zur Pflegeversicherung (6 Dezimalstellen). */
    PVSATZAN: Decimal;
    /** Beitragssatz des Arbeitnehmers in der allgemeinen gesetzlichen Rentenversicherung (4 Dezimalstellen). */
    RVSATZAN: Decimal;
    /** Rechenwert in Gleitkommadarstellung. */
    RW: Decimal;
    /** Sonderausgaben-Pauschbetrag in Euro. */
    SAP: Decimal;
    /** Freigrenze für den Solidaritätszuschlag in Euro. */
    SOLZFREI: Decimal;
    /** Solidaritätszuschlag auf die Jahreslohnsteuer in Euro, Cent (2 Dezimalstellen). */
    SOLZJ: Decimal;
    /** Zwischenwert für den Solidaritätszuschlag auf die Jahreslohnsteuer in Euro, Cent (2 Dezimalstellen). */
    SOLZMIN: Decimal;
    /** Bemessungsgrundlage des Solidaritätszuschlags zur Prüfung der Freigrenze beim Solidaritätszuschlag für sonstige Bezüge in Euro. */
    SOLZSBMG: Decimal;
    /** Zu versteuerndes Einkommen für die Ermittlung der Bemessungsgrundlage des Solidaritätszuschlags zur Prüfung der Freigrenze beim Solidaritätszuschlag für sonstige Bezüge in Euro, Cent (2 Dezimalstellen). */
    SOLZSZVE: Decimal;
    /** Tarifliche Einkommensteuer in Euro. */
    ST: Decimal;
    /** Tarifliche Einkommensteuer auf das 1,25-fache ZX in Euro. */
    ST1: Decimal;
    /** Tarifliche Einkommensteuer auf das 0,75-fache ZX in Euro. */
    ST2: Decimal;
    /** Bemessungsgrundlage für den Versorgungsfreibetrag in Cent. */
    VBEZB: Decimal;
    /** Bemessungsgrundlage für den Versorgungsfreibetrag in Cent für den sonstigen Bezug. */
    VBEZBSO: Decimal;
    /** Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro. */
    VERGL: Decimal;
    /** Auf den Höchstbetrag begrenzte Beiträge zur Arbeitslosenversicherung einschließlich Kranken- und Pflegeversicherung in Euro, Cent (2 Dezimalstellen). */
    VSPHB: Decimal;
    /** Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung sowie die gesetzliche Kranken- und soziale Pflegeversicherung nach fiktiven Beträgen oder ggf. für die private Basiskrankenversicherung und private Pflege-Pflichtversicherung in Euro, Cent (2 Dezimalstellen). */
    VSP: Decimal;
    /** Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung sowie auf den Höchstbetrag begrenzten Teilbeträgen für die Arbeitslosen-, Kranken- und Pflegeversicherung in Euro, Cent (2 Dezimalstellen). */
    VSPN: Decimal;
    /** Teilbetrag für die Arbeitslosenversicherung bei der Berechnung der Vorsorgepauschale in Euro, Cent (2 Dezimalstellen). */
    VSPALV: Decimal;
    /** Vorsorgepauschale mit Teilbeträgen für die gesetzliche Kranken- und soziale Pflegeversicherung nach fiktiven Beträgen oder ggf. für die private Basiskrankenversicherung und private Pflege-Pflichtversicherung in Euro, Cent (2 Dezimalstellen). */
    VSPKVPV: Decimal;
    /** Teilbetrag für die Rentenversicherung bei der Berechnung der Vorsorgepauschale in Euro, Cent (2 Dezimalstellen). */
    VSPR: Decimal;
    /** Erster Grenzwert in Steuerklasse V/VI in Euro. */
    W1STKL5: Decimal;
    /** Zweiter Grenzwert in Steuerklasse V/VI in Euro. */
    W2STKL5: Decimal;
    /** Dritter Grenzwert in Steuerklasse V/VI in Euro. */
    W3STKL5: Decimal;
    /** Zu versteuerndes Einkommen gem. § 32a Absatz 1 und 5 EStG in Euro, Cent (2 Dezimalstellen). */
    X: Decimal;
    /** Gem. § 32a Absatz 1 EStG (6 Dezimalstellen). */
    Y: Decimal;
    /** Auf einen Jahreslohn hochgerechnetes RE4 in Euro, Cent (2 Dezimalstellen) nach Abzug der Freibeträge nach § 39b Absatz 2 Satz 3 und 4 EStG. */
    ZRE4: Decimal;
    /** Auf einen Jahreslohn hochgerechnetes RE4 in Euro, Cent (2 Dezimalstellen). */
    ZRE4J: Decimal;
    /** Auf einen Jahreslohn hochgerechnetes RE4, ggf. nach Abzug der Entschädigungen i.S.d. § 24 Nummer 1 EStG in Euro, Cent (2 Dezimalstellen). */
    ZRE4VP: Decimal;
    /** Zwischenfeld zu ZRE4VP für die Begrenzung auf die jeweilige Beitragsbemessungsgrenze in Euro, Cent (2 Dezimalstellen). */
    ZRE4VPR: Decimal;
    /** Feste Tabellenfreibeträge (ohne Vorsorgepauschale) in Euro, Cent (2 Dezimalstellen). */
    ZTABFB: Decimal;
    /** Auf einen Jahreslohn hochgerechnetes VBEZ abzüglich FVB in Euro, Cent (2 Dezimalstellen). */
    ZVBEZ: Decimal;
    /** Auf einen Jahreslohn hochgerechnetes VBEZ in Euro, Cent (2 Dezimalstellen). */
    ZVBEZJ: Decimal;
    /** Zu versteuerndes Einkommen in Euro, Cent (2 Dezimalstellen). */
    ZVE: Decimal;
    /** Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro. */
    ZX: Decimal;
    /** Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro. */
    ZZX: Decimal;
}
/**
 * PAP constant table arrays and numeric constants.
 *
 * TAB1-TAB5 are indexed by J or K (1-based; index 0 is unused placeholder ZERO).
 * ZAHL constants are frequently-used BigDecimal values in the PAP pseudocode.
 */
interface PapConstants {
    /** Tabelle für die Prozentsätze des Versorgungsfreibetrags (index 0..54). */
    TAB1: readonly Decimal[];
    /** Tabelle für die Höchstbeträge des Versorgungsfreibetrags (index 0..54). */
    TAB2: readonly Decimal[];
    /** Tabelle für die Zuschläge zum Versorgungsfreibetrag (index 0..54). */
    TAB3: readonly Decimal[];
    /** Tabelle für die Prozentsätze des Altersentlastungsbetrags (index 0..54). */
    TAB4: readonly Decimal[];
    /** Tabelle für die Höchstbeträge des Altersentlastungsbetrags (index 0..54). */
    TAB5: readonly Decimal[];
    /** BigDecimal constant: 1 */
    ZAHL1: Decimal;
    /** BigDecimal constant: 2 */
    ZAHL2: Decimal;
    /** BigDecimal constant: 5 */
    ZAHL5: Decimal;
    /** BigDecimal constant: 7 */
    ZAHL7: Decimal;
    /** BigDecimal constant: 12 */
    ZAHL12: Decimal;
    /** BigDecimal constant: 100 */
    ZAHL100: Decimal;
    /** BigDecimal constant: 360 */
    ZAHL360: Decimal;
    /** BigDecimal constant: 500 */
    ZAHL500: Decimal;
    /** BigDecimal constant: 700 */
    ZAHL700: Decimal;
    /** BigDecimal constant: 1000 */
    ZAHL1000: Decimal;
    /** BigDecimal constant: 10000 */
    ZAHL10000: Decimal;
}
/**
 * Interface that each PAP year implementation must satisfy.
 *
 * Usage:
 * ```typescript
 * const pap: PapInstance = new Pap2026();
 * pap.setInputs({ LZZ: 2, RE4: 500000, STKL: 1, KVZ: 2.5, PVZ: 1 });
 * pap.calculate();
 * const result = pap.getOutputs();
 * // result.LSTLZZ -> 78583 (Cent)
 * ```
 */
interface PapInstance {
    /** Set input parameters. Omitted fields use PAP-defined defaults. */
    setInputs(inputs: LohnsteuerInputs): void;
    /** Execute the full PAP algorithm (MAIN and all sub-methods). */
    calculate(): void;
    /** Retrieve all output parameters after calculation. Values are in Cent. */
    getOutputs(): LohnsteuerOutputs;
}
/**
 * Default values for all input parameters as specified in the PAP XML.
 *
 * These are the values used when an input is omitted. Matches the `default`
 * attribute from each `<INPUT>` element in the PAP XML.
 */
declare const INPUT_DEFAULTS: Required<LohnsteuerInputs>;
/**
 * Names of all STANDARD output fields in the order defined by the PAP XML.
 */
declare const STANDARD_OUTPUT_NAMES: readonly ["BK", "BKS", "LSTLZZ", "SOLZLZZ", "SOLZS", "STS"];
/**
 * Names of all DBA output fields in the order defined by the PAP XML.
 */
declare const DBA_OUTPUT_NAMES: readonly ["VFRB", "VFRBS1", "VFRBS2", "WVFRB", "WVFRBO", "WVFRBM"];
/**
 * All output field names combined.
 */
declare const ALL_OUTPUT_NAMES: readonly ["BK", "BKS", "LSTLZZ", "SOLZLZZ", "SOLZS", "STS", "VFRB", "VFRBS1", "VFRBS2", "WVFRB", "WVFRBO", "WVFRBM"];

/**
 * Calculate German wage tax (Lohnsteuer) for the given year and inputs.
 *
 * @param year - Tax year (e.g. 2025, 2026)
 * @param inputs - Input parameters (all monetary values in Cent)
 * @returns Output values (all monetary values in Cent)
 *
 * @example
 * ```typescript
 * const result = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1 });
 * console.log(result.LSTLZZ); // Wage tax in Cent
 * ```
 */
declare function calculate(year: number, inputs: LohnsteuerInputs): LohnsteuerOutputs;
/** List of supported tax years. */
declare const SUPPORTED_YEARS: number[];

export { ALL_OUTPUT_NAMES, DBA_OUTPUT_NAMES, INPUT_DEFAULTS, type LohnsteuerInputs, type LohnsteuerInternals, type LohnsteuerOutputs, type PapConstants, type PapInstance, STANDARD_OUTPUT_NAMES, SUPPORTED_YEARS, calculate };
