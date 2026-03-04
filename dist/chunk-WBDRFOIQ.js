// src/core/types.ts
var INPUT_DEFAULTS = {
  af: 1,
  AJAHR: 0,
  ALTER1: 0,
  ALV: 0,
  f: 1,
  JFREIB: 0,
  JHINZU: 0,
  JRE4: 0,
  JRE4ENT: 0,
  JVBEZ: 0,
  KRV: 0,
  KVZ: 0,
  LZZ: 1,
  LZZFREIB: 0,
  LZZHINZU: 0,
  MBV: 0,
  PKPV: 0,
  PKPVAGZ: 0,
  PKV: 0,
  PVA: 0,
  PVS: 0,
  PVZ: 0,
  R: 0,
  RE4: 0,
  SONSTB: 0,
  SONSTENT: 0,
  STERBE: 0,
  STKL: 1,
  VBEZ: 0,
  VBEZM: 0,
  VBEZS: 0,
  VBS: 0,
  VJAHR: 0,
  ZKF: 0,
  ZMVB: 0
};
var STANDARD_OUTPUT_NAMES = [
  "BK",
  "BKS",
  "LSTLZZ",
  "SOLZLZZ",
  "SOLZS",
  "STS"
];
var DBA_OUTPUT_NAMES = [
  "VFRB",
  "VFRBS1",
  "VFRBS2",
  "WVFRB",
  "WVFRBO",
  "WVFRBM"
];
var ALL_OUTPUT_NAMES = [
  ...STANDARD_OUTPUT_NAMES,
  ...DBA_OUTPUT_NAMES
];

// src/core/pap2025.ts
import Decimal from "decimal.js";
var Pap2025 = class {
  // -------------------------------------------------------------------------
  // Inputs: BigDecimal type -> Decimal
  // -------------------------------------------------------------------------
  RE4 = new Decimal(0);
  VBEZ = new Decimal(0);
  VBEZM = new Decimal(0);
  VBEZS = new Decimal(0);
  VBS = new Decimal(0);
  LZZFREIB = new Decimal(0);
  LZZHINZU = new Decimal(0);
  JFREIB = new Decimal(0);
  JHINZU = new Decimal(0);
  JRE4 = new Decimal(0);
  JRE4ENT = new Decimal(0);
  JVBEZ = new Decimal(0);
  SONSTB = new Decimal(0);
  SONSTENT = new Decimal(0);
  STERBE = new Decimal(0);
  KVZ = new Decimal(0);
  PVA = new Decimal(0);
  PKPV = new Decimal(0);
  MBV = new Decimal(0);
  ZKF = new Decimal(0);
  // -------------------------------------------------------------------------
  // Inputs: int type -> number
  // -------------------------------------------------------------------------
  af = 1;
  AJAHR = 0;
  ALTER1 = 0;
  KRV = 0;
  LZZ = 1;
  PKV = 0;
  PVS = 0;
  PVZ = 0;
  R = 0;
  STKL = 1;
  VJAHR = 0;
  ZMVB = 0;
  // -------------------------------------------------------------------------
  // Inputs: double type -> number
  // -------------------------------------------------------------------------
  f = 1;
  // -------------------------------------------------------------------------
  // Outputs: all BigDecimal -> Decimal
  // -------------------------------------------------------------------------
  BK = new Decimal(0);
  BKS = new Decimal(0);
  LSTLZZ = new Decimal(0);
  SOLZLZZ = new Decimal(0);
  SOLZS = new Decimal(0);
  STS = new Decimal(0);
  VFRB = new Decimal(0);
  VFRBS1 = new Decimal(0);
  VFRBS2 = new Decimal(0);
  WVFRB = new Decimal(0);
  WVFRBO = new Decimal(0);
  WVFRBM = new Decimal(0);
  // 2025-specific outputs (VKVLZZ and VKVSONST are not in LohnsteuerOutputs,
  // but are computed internally for the algorithm)
  VKVLZZ = new Decimal(0);
  VKVSONST = new Decimal(0);
  // -------------------------------------------------------------------------
  // Internals: BigDecimal -> Decimal
  // -------------------------------------------------------------------------
  ALTE = new Decimal(0);
  ANP = new Decimal(0);
  ANTEIL1 = new Decimal(0);
  BBGKVPV = new Decimal(0);
  BBGRV = new Decimal(0);
  // 2025 uses BBGRV, not BBGRVALV
  BMG = new Decimal(0);
  DIFF = new Decimal(0);
  EFA = new Decimal(0);
  FVB = new Decimal(0);
  FVBSO = new Decimal(0);
  FVBZ = new Decimal(0);
  FVBZSO = new Decimal(0);
  GFB = new Decimal(0);
  HBALTE = new Decimal(0);
  HFVB = new Decimal(0);
  HFVBZ = new Decimal(0);
  HFVBZSO = new Decimal(0);
  HOCH = new Decimal(0);
  JBMG = new Decimal(0);
  JLFREIB = new Decimal(0);
  JLHINZU = new Decimal(0);
  JW = new Decimal(0);
  KFB = new Decimal(0);
  KVSATZAG = new Decimal(0);
  // 2025 only
  KVSATZAN = new Decimal(0);
  LSTJAHR = new Decimal(0);
  LSTOSO = new Decimal(0);
  LSTSO = new Decimal(0);
  MIST = new Decimal(0);
  PVSATZAG = new Decimal(0);
  // 2025 only
  PVSATZAN = new Decimal(0);
  RVSATZAN = new Decimal(0);
  RW = new Decimal(0);
  SAP = new Decimal(0);
  SOLZFREI = new Decimal(0);
  SOLZJ = new Decimal(0);
  SOLZMIN = new Decimal(0);
  SOLZSBMG = new Decimal(0);
  SOLZSZVE = new Decimal(0);
  SOLZVBMG = new Decimal(0);
  // 2025 only
  ST = new Decimal(0);
  ST1 = new Decimal(0);
  ST2 = new Decimal(0);
  VBEZB = new Decimal(0);
  VBEZBSO = new Decimal(0);
  VERGL = new Decimal(0);
  VHB = new Decimal(0);
  // 2025 only
  VKV = new Decimal(0);
  // 2025 only
  VSP = new Decimal(0);
  VSPN = new Decimal(0);
  VSP1 = new Decimal(0);
  // 2025 only (replaces VSPR)
  VSP2 = new Decimal(0);
  // 2025 only (replaces VSPKVPV)
  VSP3 = new Decimal(0);
  // 2025 only
  W1STKL5 = new Decimal(0);
  W2STKL5 = new Decimal(0);
  W3STKL5 = new Decimal(0);
  X = new Decimal(0);
  Y = new Decimal(0);
  ZRE4 = new Decimal(0);
  ZRE4J = new Decimal(0);
  ZRE4VP = new Decimal(0);
  ZTABFB = new Decimal(0);
  ZVBEZ = new Decimal(0);
  ZVBEZJ = new Decimal(0);
  ZVE = new Decimal(0);
  ZX = new Decimal(0);
  ZZX = new Decimal(0);
  // -------------------------------------------------------------------------
  // Internals: int -> number
  // -------------------------------------------------------------------------
  J = 0;
  K = 0;
  KZTAB = 0;
  // -------------------------------------------------------------------------
  // Constants: TAB1-TAB5 (index 0..54) -- IDENTICAL to 2026
  // -------------------------------------------------------------------------
  TAB1 = [
    new Decimal(0),
    new Decimal("0.4"),
    new Decimal("0.384"),
    new Decimal("0.368"),
    new Decimal("0.352"),
    new Decimal("0.336"),
    new Decimal("0.32"),
    new Decimal("0.304"),
    new Decimal("0.288"),
    new Decimal("0.272"),
    new Decimal("0.256"),
    new Decimal("0.24"),
    new Decimal("0.224"),
    new Decimal("0.208"),
    new Decimal("0.192"),
    new Decimal("0.176"),
    new Decimal("0.16"),
    new Decimal("0.152"),
    new Decimal("0.144"),
    new Decimal("0.14"),
    new Decimal("0.136"),
    new Decimal("0.132"),
    new Decimal("0.128"),
    new Decimal("0.124"),
    new Decimal("0.12"),
    new Decimal("0.116"),
    new Decimal("0.112"),
    new Decimal("0.108"),
    new Decimal("0.104"),
    new Decimal("0.1"),
    new Decimal("0.096"),
    new Decimal("0.092"),
    new Decimal("0.088"),
    new Decimal("0.084"),
    new Decimal("0.08"),
    new Decimal("0.076"),
    new Decimal("0.072"),
    new Decimal("0.068"),
    new Decimal("0.064"),
    new Decimal("0.06"),
    new Decimal("0.056"),
    new Decimal("0.052"),
    new Decimal("0.048"),
    new Decimal("0.044"),
    new Decimal("0.04"),
    new Decimal("0.036"),
    new Decimal("0.032"),
    new Decimal("0.028"),
    new Decimal("0.024"),
    new Decimal("0.02"),
    new Decimal("0.016"),
    new Decimal("0.012"),
    new Decimal("0.008"),
    new Decimal("0.004"),
    new Decimal(0)
  ];
  TAB2 = [
    new Decimal(0),
    new Decimal(3e3),
    new Decimal(2880),
    new Decimal(2760),
    new Decimal(2640),
    new Decimal(2520),
    new Decimal(2400),
    new Decimal(2280),
    new Decimal(2160),
    new Decimal(2040),
    new Decimal(1920),
    new Decimal(1800),
    new Decimal(1680),
    new Decimal(1560),
    new Decimal(1440),
    new Decimal(1320),
    new Decimal(1200),
    new Decimal(1140),
    new Decimal(1080),
    new Decimal(1050),
    new Decimal(1020),
    new Decimal(990),
    new Decimal(960),
    new Decimal(930),
    new Decimal(900),
    new Decimal(870),
    new Decimal(840),
    new Decimal(810),
    new Decimal(780),
    new Decimal(750),
    new Decimal(720),
    new Decimal(690),
    new Decimal(660),
    new Decimal(630),
    new Decimal(600),
    new Decimal(570),
    new Decimal(540),
    new Decimal(510),
    new Decimal(480),
    new Decimal(450),
    new Decimal(420),
    new Decimal(390),
    new Decimal(360),
    new Decimal(330),
    new Decimal(300),
    new Decimal(270),
    new Decimal(240),
    new Decimal(210),
    new Decimal(180),
    new Decimal(150),
    new Decimal(120),
    new Decimal(90),
    new Decimal(60),
    new Decimal(30),
    new Decimal(0)
  ];
  TAB3 = [
    new Decimal(0),
    new Decimal(900),
    new Decimal(864),
    new Decimal(828),
    new Decimal(792),
    new Decimal(756),
    new Decimal(720),
    new Decimal(684),
    new Decimal(648),
    new Decimal(612),
    new Decimal(576),
    new Decimal(540),
    new Decimal(504),
    new Decimal(468),
    new Decimal(432),
    new Decimal(396),
    new Decimal(360),
    new Decimal(342),
    new Decimal(324),
    new Decimal(315),
    new Decimal(306),
    new Decimal(297),
    new Decimal(288),
    new Decimal(279),
    new Decimal(270),
    new Decimal(261),
    new Decimal(252),
    new Decimal(243),
    new Decimal(234),
    new Decimal(225),
    new Decimal(216),
    new Decimal(207),
    new Decimal(198),
    new Decimal(189),
    new Decimal(180),
    new Decimal(171),
    new Decimal(162),
    new Decimal(153),
    new Decimal(144),
    new Decimal(135),
    new Decimal(126),
    new Decimal(117),
    new Decimal(108),
    new Decimal(99),
    new Decimal(90),
    new Decimal(81),
    new Decimal(72),
    new Decimal(63),
    new Decimal(54),
    new Decimal(45),
    new Decimal(36),
    new Decimal(27),
    new Decimal(18),
    new Decimal(9),
    new Decimal(0)
  ];
  TAB4 = [
    new Decimal(0),
    new Decimal("0.4"),
    new Decimal("0.384"),
    new Decimal("0.368"),
    new Decimal("0.352"),
    new Decimal("0.336"),
    new Decimal("0.32"),
    new Decimal("0.304"),
    new Decimal("0.288"),
    new Decimal("0.272"),
    new Decimal("0.256"),
    new Decimal("0.24"),
    new Decimal("0.224"),
    new Decimal("0.208"),
    new Decimal("0.192"),
    new Decimal("0.176"),
    new Decimal("0.16"),
    new Decimal("0.152"),
    new Decimal("0.144"),
    new Decimal("0.14"),
    new Decimal("0.136"),
    new Decimal("0.132"),
    new Decimal("0.128"),
    new Decimal("0.124"),
    new Decimal("0.12"),
    new Decimal("0.116"),
    new Decimal("0.112"),
    new Decimal("0.108"),
    new Decimal("0.104"),
    new Decimal("0.1"),
    new Decimal("0.096"),
    new Decimal("0.092"),
    new Decimal("0.088"),
    new Decimal("0.084"),
    new Decimal("0.08"),
    new Decimal("0.076"),
    new Decimal("0.072"),
    new Decimal("0.068"),
    new Decimal("0.064"),
    new Decimal("0.06"),
    new Decimal("0.056"),
    new Decimal("0.052"),
    new Decimal("0.048"),
    new Decimal("0.044"),
    new Decimal("0.04"),
    new Decimal("0.036"),
    new Decimal("0.032"),
    new Decimal("0.028"),
    new Decimal("0.024"),
    new Decimal("0.02"),
    new Decimal("0.016"),
    new Decimal("0.012"),
    new Decimal("0.008"),
    new Decimal("0.004"),
    new Decimal(0)
  ];
  TAB5 = [
    new Decimal(0),
    new Decimal(1900),
    new Decimal(1824),
    new Decimal(1748),
    new Decimal(1672),
    new Decimal(1596),
    new Decimal(1520),
    new Decimal(1444),
    new Decimal(1368),
    new Decimal(1292),
    new Decimal(1216),
    new Decimal(1140),
    new Decimal(1064),
    new Decimal(988),
    new Decimal(912),
    new Decimal(836),
    new Decimal(760),
    new Decimal(722),
    new Decimal(684),
    new Decimal(665),
    new Decimal(646),
    new Decimal(627),
    new Decimal(608),
    new Decimal(589),
    new Decimal(570),
    new Decimal(551),
    new Decimal(532),
    new Decimal(513),
    new Decimal(494),
    new Decimal(475),
    new Decimal(456),
    new Decimal(437),
    new Decimal(418),
    new Decimal(399),
    new Decimal(380),
    new Decimal(361),
    new Decimal(342),
    new Decimal(323),
    new Decimal(304),
    new Decimal(285),
    new Decimal(266),
    new Decimal(247),
    new Decimal(228),
    new Decimal(209),
    new Decimal(190),
    new Decimal(171),
    new Decimal(152),
    new Decimal(133),
    new Decimal(114),
    new Decimal(95),
    new Decimal(76),
    new Decimal(57),
    new Decimal(38),
    new Decimal(19),
    new Decimal(0)
  ];
  // -------------------------------------------------------------------------
  // ZAHL constants
  // -------------------------------------------------------------------------
  ZAHL1 = new Decimal(1);
  ZAHL2 = new Decimal(2);
  ZAHL5 = new Decimal(5);
  ZAHL7 = new Decimal(7);
  ZAHL12 = new Decimal(12);
  ZAHL100 = new Decimal(100);
  ZAHL360 = new Decimal(360);
  ZAHL500 = new Decimal(500);
  ZAHL700 = new Decimal(700);
  ZAHL1000 = new Decimal(1e3);
  ZAHL10000 = new Decimal(1e4);
  // =========================================================================
  // Public API
  // =========================================================================
  setInputs(inputs) {
    const merged = { ...INPUT_DEFAULTS, ...inputs };
    this.RE4 = new Decimal(merged.RE4);
    this.VBEZ = new Decimal(merged.VBEZ);
    this.VBEZM = new Decimal(merged.VBEZM);
    this.VBEZS = new Decimal(merged.VBEZS);
    this.VBS = new Decimal(merged.VBS);
    this.LZZFREIB = new Decimal(merged.LZZFREIB);
    this.LZZHINZU = new Decimal(merged.LZZHINZU);
    this.JFREIB = new Decimal(merged.JFREIB);
    this.JHINZU = new Decimal(merged.JHINZU);
    this.JRE4 = new Decimal(merged.JRE4);
    this.JRE4ENT = new Decimal(merged.JRE4ENT);
    this.JVBEZ = new Decimal(merged.JVBEZ);
    this.SONSTB = new Decimal(merged.SONSTB);
    this.SONSTENT = new Decimal(merged.SONSTENT);
    this.STERBE = new Decimal(merged.STERBE);
    this.KVZ = new Decimal(merged.KVZ);
    this.PVA = new Decimal(merged.PVA);
    this.PKPV = new Decimal(merged.PKPV);
    this.MBV = new Decimal(merged.MBV);
    this.ZKF = new Decimal(merged.ZKF);
    this.af = merged.af;
    this.AJAHR = merged.AJAHR;
    this.ALTER1 = merged.ALTER1;
    this.KRV = merged.KRV;
    this.LZZ = merged.LZZ;
    this.PKV = merged.PKV;
    this.PVS = merged.PVS;
    this.PVZ = merged.PVZ;
    this.R = merged.R;
    this.STKL = merged.STKL;
    this.VJAHR = merged.VJAHR;
    this.ZMVB = merged.ZMVB;
    this.f = merged.f;
    this.BK = new Decimal(0);
    this.BKS = new Decimal(0);
    this.LSTLZZ = new Decimal(0);
    this.SOLZLZZ = new Decimal(0);
    this.SOLZS = new Decimal(0);
    this.STS = new Decimal(0);
    this.VFRB = new Decimal(0);
    this.VFRBS1 = new Decimal(0);
    this.VFRBS2 = new Decimal(0);
    this.WVFRB = new Decimal(0);
    this.WVFRBO = new Decimal(0);
    this.WVFRBM = new Decimal(0);
    this.VKVLZZ = new Decimal(0);
    this.VKVSONST = new Decimal(0);
    this.ALTE = new Decimal(0);
    this.ANP = new Decimal(0);
    this.ANTEIL1 = new Decimal(0);
    this.BBGKVPV = new Decimal(0);
    this.BBGRV = new Decimal(0);
    this.BMG = new Decimal(0);
    this.DIFF = new Decimal(0);
    this.EFA = new Decimal(0);
    this.FVB = new Decimal(0);
    this.FVBSO = new Decimal(0);
    this.FVBZ = new Decimal(0);
    this.FVBZSO = new Decimal(0);
    this.GFB = new Decimal(0);
    this.HBALTE = new Decimal(0);
    this.HFVB = new Decimal(0);
    this.HFVBZ = new Decimal(0);
    this.HFVBZSO = new Decimal(0);
    this.HOCH = new Decimal(0);
    this.J = 0;
    this.JBMG = new Decimal(0);
    this.JLFREIB = new Decimal(0);
    this.JLHINZU = new Decimal(0);
    this.JW = new Decimal(0);
    this.K = 0;
    this.KFB = new Decimal(0);
    this.KVSATZAG = new Decimal(0);
    this.KVSATZAN = new Decimal(0);
    this.KZTAB = 0;
    this.LSTJAHR = new Decimal(0);
    this.LSTOSO = new Decimal(0);
    this.LSTSO = new Decimal(0);
    this.MIST = new Decimal(0);
    this.PVSATZAG = new Decimal(0);
    this.PVSATZAN = new Decimal(0);
    this.RVSATZAN = new Decimal(0);
    this.RW = new Decimal(0);
    this.SAP = new Decimal(0);
    this.SOLZFREI = new Decimal(0);
    this.SOLZJ = new Decimal(0);
    this.SOLZMIN = new Decimal(0);
    this.SOLZSBMG = new Decimal(0);
    this.SOLZSZVE = new Decimal(0);
    this.SOLZVBMG = new Decimal(0);
    this.ST = new Decimal(0);
    this.ST1 = new Decimal(0);
    this.ST2 = new Decimal(0);
    this.VBEZB = new Decimal(0);
    this.VBEZBSO = new Decimal(0);
    this.VERGL = new Decimal(0);
    this.VHB = new Decimal(0);
    this.VKV = new Decimal(0);
    this.VSP = new Decimal(0);
    this.VSPN = new Decimal(0);
    this.VSP1 = new Decimal(0);
    this.VSP2 = new Decimal(0);
    this.VSP3 = new Decimal(0);
    this.W1STKL5 = new Decimal(0);
    this.W2STKL5 = new Decimal(0);
    this.W3STKL5 = new Decimal(0);
    this.X = new Decimal(0);
    this.Y = new Decimal(0);
    this.ZRE4 = new Decimal(0);
    this.ZRE4J = new Decimal(0);
    this.ZRE4VP = new Decimal(0);
    this.ZTABFB = new Decimal(0);
    this.ZVBEZ = new Decimal(0);
    this.ZVBEZJ = new Decimal(0);
    this.ZVE = new Decimal(0);
    this.ZX = new Decimal(0);
    this.ZZX = new Decimal(0);
  }
  calculate() {
    this.MPARA();
    this.MRE4JL();
    this.VBEZBSO = new Decimal(0);
    this.MRE4();
    this.MRE4ABZ();
    this.MBERECH();
    this.MSONST();
  }
  getOutputs() {
    return {
      BK: this.BK.trunc().toNumber(),
      BKS: this.BKS.trunc().toNumber(),
      LSTLZZ: this.LSTLZZ.trunc().toNumber(),
      SOLZLZZ: this.SOLZLZZ.trunc().toNumber(),
      SOLZS: this.SOLZS.trunc().toNumber(),
      STS: this.STS.trunc().toNumber(),
      VFRB: this.VFRB.trunc().toNumber(),
      VFRBS1: this.VFRBS1.trunc().toNumber(),
      VFRBS2: this.VFRBS2.trunc().toNumber(),
      WVFRB: this.WVFRB.trunc().toNumber(),
      WVFRBO: this.WVFRBO.trunc().toNumber(),
      WVFRBM: this.WVFRBM.trunc().toNumber()
    };
  }
  // =========================================================================
  // PAP Methods
  // =========================================================================
  /**
   * Zuweisung von Werten für bestimmte Sozialversicherungsparameter
   * PAP Seite 14
   *
   * DIFFERS FROM 2026: Conditional BBGRV/RVSATZAN (behind KRV check);
   * uses KVSATZAG/PVSATZAG; different constant values.
   */
  MPARA() {
    if (this.KRV < 1) {
      this.BBGRV = new Decimal(96600);
      this.RVSATZAN = new Decimal("0.093");
    }
    this.BBGKVPV = new Decimal(66150);
    this.KVSATZAN = this.KVZ.div(this.ZAHL2).div(this.ZAHL100).plus(new Decimal("0.07"));
    this.KVSATZAG = new Decimal("0.0125").plus(new Decimal("0.07"));
    if (this.PVS === 1) {
      this.PVSATZAN = new Decimal("0.023");
      this.PVSATZAG = new Decimal("0.013");
    } else {
      this.PVSATZAN = new Decimal("0.018");
      this.PVSATZAG = new Decimal("0.018");
    }
    if (this.PVZ === 1) {
      this.PVSATZAN = this.PVSATZAN.plus(new Decimal("0.006"));
    } else {
      this.PVSATZAN = this.PVSATZAN.minus(this.PVA.times(new Decimal("0.0025")));
    }
    this.W1STKL5 = new Decimal(13785);
    this.W2STKL5 = new Decimal(34240);
    this.W3STKL5 = new Decimal(222260);
    this.GFB = new Decimal(12096);
    this.SOLZFREI = new Decimal(19950);
  }
  /**
   * Ermittlung des Jahresarbeitslohns nach § 39 b Abs. 2 Satz 2 EStG
   * PAP Seite 15 -- IDENTICAL to 2026
   */
  MRE4JL() {
    if (this.LZZ === 1) {
      this.ZRE4J = this.RE4.div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    } else if (this.LZZ === 2) {
      this.ZRE4J = this.RE4.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    } else if (this.LZZ === 3) {
      this.ZRE4J = this.RE4.times(this.ZAHL360).div(this.ZAHL700).toDP(2, Decimal.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.times(this.ZAHL360).div(this.ZAHL700).toDP(2, Decimal.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.times(this.ZAHL360).div(this.ZAHL700).toDP(2, Decimal.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.times(this.ZAHL360).div(this.ZAHL700).toDP(2, Decimal.ROUND_DOWN);
    } else {
      this.ZRE4J = this.RE4.times(this.ZAHL360).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.times(this.ZAHL360).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.times(this.ZAHL360).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.times(this.ZAHL360).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    }
    if (this.af === 0) {
      this.f = 1;
    }
  }
  /**
   * Freibeträge für Versorgungsbezüge, Altersentlastungsbetrag
   * (§ 39b Abs. 2 Satz 3 EStG)
   * PAP Seite 16 -- IDENTICAL to 2026
   */
  MRE4() {
    if (this.ZVBEZJ.cmp(new Decimal(0)) === 0) {
      this.FVBZ = new Decimal(0);
      this.FVB = new Decimal(0);
      this.FVBZSO = new Decimal(0);
      this.FVBSO = new Decimal(0);
    } else {
      if (this.VJAHR < 2006) {
        this.J = 1;
      } else if (this.VJAHR < 2058) {
        this.J = this.VJAHR - 2004;
      } else {
        this.J = 54;
      }
      if (this.LZZ === 1) {
        this.VBEZB = this.VBEZM.times(new Decimal(this.ZMVB)).plus(this.VBEZS);
        this.HFVB = this.TAB2[this.J].div(this.ZAHL12).times(new Decimal(this.ZMVB)).toDP(0, Decimal.ROUND_UP);
        this.FVBZ = this.TAB3[this.J].div(this.ZAHL12).times(new Decimal(this.ZMVB)).toDP(0, Decimal.ROUND_UP);
      } else {
        this.VBEZB = this.VBEZM.times(this.ZAHL12).plus(this.VBEZS).toDP(2, Decimal.ROUND_DOWN);
        this.HFVB = this.TAB2[this.J];
        this.FVBZ = this.TAB3[this.J];
      }
      this.FVB = this.VBEZB.times(this.TAB1[this.J]).div(this.ZAHL100).toDP(2, Decimal.ROUND_UP);
      if (this.FVB.cmp(this.HFVB) === 1) {
        this.FVB = this.HFVB;
      }
      if (this.FVB.cmp(this.ZVBEZJ) === 1) {
        this.FVB = this.ZVBEZJ;
      }
      this.FVBSO = this.FVB.plus(this.VBEZBSO.times(this.TAB1[this.J]).div(this.ZAHL100)).toDP(2, Decimal.ROUND_UP);
      if (this.FVBSO.cmp(this.TAB2[this.J]) === 1) {
        this.FVBSO = this.TAB2[this.J];
      }
      this.HFVBZSO = this.VBEZB.plus(this.VBEZBSO).div(this.ZAHL100).minus(this.FVBSO).toDP(2, Decimal.ROUND_DOWN);
      this.FVBZSO = this.FVBZ.plus(this.VBEZBSO.div(this.ZAHL100)).toDP(0, Decimal.ROUND_UP);
      if (this.FVBZSO.cmp(this.HFVBZSO) === 1) {
        this.FVBZSO = this.HFVBZSO.toDP(0, Decimal.ROUND_UP);
      }
      if (this.FVBZSO.cmp(this.TAB3[this.J]) === 1) {
        this.FVBZSO = this.TAB3[this.J];
      }
      this.HFVBZ = this.VBEZB.div(this.ZAHL100).minus(this.FVB).toDP(2, Decimal.ROUND_DOWN);
      if (this.FVBZ.cmp(this.HFVBZ) === 1) {
        this.FVBZ = this.HFVBZ.toDP(0, Decimal.ROUND_UP);
      }
    }
    this.MRE4ALTE();
  }
  /**
   * Altersentlastungsbetrag (§ 39b Abs. 2 Satz 3 EStG)
   * PAP Seite 17 -- IDENTICAL to 2026
   */
  MRE4ALTE() {
    if (this.ALTER1 === 0) {
      this.ALTE = new Decimal(0);
    } else {
      if (this.AJAHR < 2006) {
        this.K = 1;
      } else if (this.AJAHR < 2058) {
        this.K = this.AJAHR - 2004;
      } else {
        this.K = 54;
      }
      this.BMG = this.ZRE4J.minus(this.ZVBEZJ);
      this.ALTE = this.BMG.times(this.TAB4[this.K]).toDP(0, Decimal.ROUND_UP);
      this.HBALTE = this.TAB5[this.K];
      if (this.ALTE.cmp(this.HBALTE) === 1) {
        this.ALTE = this.HBALTE;
      }
    }
  }
  /**
   * Ermittlung des Jahresarbeitslohns nach Abzug der Freibeträge
   * nach § 39 b Abs. 2 Satz 3 und 4 EStG
   * PAP Seite 20 -- IDENTICAL to 2026
   */
  MRE4ABZ() {
    this.ZRE4 = this.ZRE4J.minus(this.FVB).minus(this.ALTE).minus(this.JLFREIB).plus(this.JLHINZU).toDP(2, Decimal.ROUND_DOWN);
    if (this.ZRE4.cmp(new Decimal(0)) === -1) {
      this.ZRE4 = new Decimal(0);
    }
    this.ZRE4VP = this.ZRE4J;
    this.ZVBEZ = this.ZVBEZJ.minus(this.FVB).toDP(2, Decimal.ROUND_DOWN);
    if (this.ZVBEZ.cmp(new Decimal(0)) === -1) {
      this.ZVBEZ = new Decimal(0);
    }
  }
  /**
   * Berechnung fuer laufende Lohnzahlungszeitraueme
   * PAP Seite 21
   *
   * DIFFERS FROM 2026: Calls UPVKVLZZ after UPLSTLZZ
   */
  MBERECH() {
    this.MZTABFB();
    this.VFRB = this.ANP.plus(this.FVB.plus(this.FVBZ)).times(this.ZAHL100).toDP(0, Decimal.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRB = this.ZVE.minus(this.GFB).times(this.ZAHL100).toDP(0, Decimal.ROUND_DOWN);
    if (this.WVFRB.cmp(new Decimal(0)) === -1) {
      this.WVFRB = new Decimal(0);
    }
    this.LSTJAHR = this.ST.times(new Decimal(this.f)).toDP(0, Decimal.ROUND_DOWN);
    this.UPLSTLZZ();
    this.UPVKVLZZ();
    if (this.ZKF.cmp(new Decimal(0)) === 1) {
      this.ZTABFB = this.ZTABFB.plus(this.KFB);
      this.MRE4ABZ();
      this.MLSTJAHR();
      this.JBMG = this.ST.times(new Decimal(this.f)).toDP(0, Decimal.ROUND_DOWN);
    } else {
      this.JBMG = this.LSTJAHR;
    }
    this.MSOLZ();
  }
  /**
   * Ermittlung der festen Tabellenfreibeträge (ohne Vorsorgepauschale)
   * PAP Seite 22
   *
   * DIFFERS FROM 2026: KFB multipliers are 9600/4800 (vs 9756/4878)
   */
  MZTABFB() {
    this.ANP = new Decimal(0);
    if (this.ZVBEZ.cmp(new Decimal(0)) >= 0 && this.ZVBEZ.cmp(this.FVBZ) === -1) {
      this.FVBZ = new Decimal(this.ZVBEZ.trunc().toNumber());
    }
    if (this.STKL < 6) {
      if (this.ZVBEZ.cmp(new Decimal(0)) === 1) {
        if (this.ZVBEZ.minus(this.FVBZ).cmp(new Decimal(102)) === -1) {
          this.ANP = this.ZVBEZ.minus(this.FVBZ).toDP(0, Decimal.ROUND_UP);
        } else {
          this.ANP = new Decimal(102);
        }
      }
    } else {
      this.FVBZ = new Decimal(0);
      this.FVBZSO = new Decimal(0);
    }
    if (this.STKL < 6) {
      if (this.ZRE4.cmp(this.ZVBEZ) === 1) {
        if (this.ZRE4.minus(this.ZVBEZ).cmp(new Decimal(1230)) === -1) {
          this.ANP = this.ANP.plus(this.ZRE4).minus(this.ZVBEZ).toDP(0, Decimal.ROUND_UP);
        } else {
          this.ANP = this.ANP.plus(new Decimal(1230));
        }
      }
    }
    this.KZTAB = 1;
    if (this.STKL === 1) {
      this.SAP = new Decimal(36);
      this.KFB = this.ZKF.times(new Decimal(9600)).toDP(0, Decimal.ROUND_DOWN);
    } else if (this.STKL === 2) {
      this.EFA = new Decimal(4260);
      this.SAP = new Decimal(36);
      this.KFB = this.ZKF.times(new Decimal(9600)).toDP(0, Decimal.ROUND_DOWN);
    } else if (this.STKL === 3) {
      this.KZTAB = 2;
      this.SAP = new Decimal(36);
      this.KFB = this.ZKF.times(new Decimal(9600)).toDP(0, Decimal.ROUND_DOWN);
    } else if (this.STKL === 4) {
      this.SAP = new Decimal(36);
      this.KFB = this.ZKF.times(new Decimal(4800)).toDP(0, Decimal.ROUND_DOWN);
    } else if (this.STKL === 5) {
      this.SAP = new Decimal(36);
      this.KFB = new Decimal(0);
    } else {
      this.KFB = new Decimal(0);
    }
    this.ZTABFB = this.EFA.plus(this.ANP).plus(this.SAP).plus(this.FVBZ).toDP(2, Decimal.ROUND_DOWN);
  }
  /**
   * Ermittlung Jahreslohnsteuer
   * PAP Seite 23 -- IDENTICAL to 2026
   */
  MLSTJAHR() {
    this.UPEVP();
    this.ZVE = this.ZRE4.minus(this.ZTABFB).minus(this.VSP);
    this.UPMLST();
  }
  /**
   * PAP Seite 24 -- 2025 specific: UPVKVLZZ
   */
  UPVKVLZZ() {
    this.UPVKV();
    this.JW = this.VKV;
    this.UPANTEIL();
    this.VKVLZZ = this.ANTEIL1;
  }
  /**
   * PAP Seite 24 -- 2025 specific: UPVKV
   */
  UPVKV() {
    if (this.PKV > 0) {
      if (this.VSP2.cmp(this.VSP3) === 1) {
        this.VKV = this.VSP2.times(this.ZAHL100);
      } else {
        this.VKV = this.VSP3.times(this.ZAHL100);
      }
    } else {
      this.VKV = new Decimal(0);
    }
  }
  /**
   * PAP Seite 25
   */
  UPLSTLZZ() {
    this.JW = this.LSTJAHR.times(this.ZAHL100);
    this.UPANTEIL();
    this.LSTLZZ = this.ANTEIL1;
  }
  /**
   * PAP Seite 26
   */
  UPMLST() {
    if (this.ZVE.cmp(this.ZAHL1) === -1) {
      this.ZVE = new Decimal(0);
      this.X = new Decimal(0);
    } else {
      this.X = this.ZVE.div(new Decimal(this.KZTAB)).toDP(0, Decimal.ROUND_DOWN);
    }
    if (this.STKL < 5) {
      this.UPTAB25();
    } else {
      this.MST5_6();
    }
  }
  /**
   * Vorsorgepauschale (§ 39b Absatz 2 Satz 5 Nummer 3 und Absatz 4 EStG)
   * PAP Seite 27
   *
   * DIFFERS FROM 2026: Completely different algorithm.
   * Uses VSP1/VSP2/VHB/VSPN and calls MVSP instead of
   * VSPR/VSPKVPV/MVSPKVPV/MVSPHB.
   */
  UPEVP() {
    if (this.KRV === 1) {
      this.VSP1 = new Decimal(0);
    } else {
      if (this.ZRE4VP.cmp(this.BBGRV) === 1) {
        this.ZRE4VP = this.BBGRV;
      }
      this.VSP1 = this.ZRE4VP.times(this.RVSATZAN).toDP(2, Decimal.ROUND_DOWN);
    }
    this.VSP2 = this.ZRE4VP.times(new Decimal("0.12")).toDP(2, Decimal.ROUND_DOWN);
    if (this.STKL === 3) {
      this.VHB = new Decimal(3e3);
    } else {
      this.VHB = new Decimal(1900);
    }
    if (this.VSP2.cmp(this.VHB) === 1) {
      this.VSP2 = this.VHB;
    }
    this.VSPN = this.VSP1.plus(this.VSP2).toDP(0, Decimal.ROUND_UP);
    this.MVSP();
    if (this.VSPN.cmp(this.VSP) === 1) {
      this.VSP = this.VSPN.toDP(2, Decimal.ROUND_DOWN);
    }
  }
  /**
   * Vorsorgepauschale (§39b Abs. 2 Satz 5 Nr 3 EStG) Vergleichsberechnung
   * fuer Guenstigerpruefung
   * PAP Seite 28
   *
   * DIFFERS FROM 2026: This method does not exist in 2026
   * (replaced by MVSPKVPV + MVSPHB).
   */
  MVSP() {
    if (this.ZRE4VP.cmp(this.BBGKVPV) === 1) {
      this.ZRE4VP = this.BBGKVPV;
    }
    if (this.PKV > 0) {
      if (this.STKL === 6) {
        this.VSP3 = new Decimal(0);
      } else {
        this.VSP3 = this.PKPV.times(this.ZAHL12).div(this.ZAHL100);
        if (this.PKV === 2) {
          this.VSP3 = this.VSP3.minus(
            this.ZRE4VP.times(this.KVSATZAG.plus(this.PVSATZAG))
          ).toDP(2, Decimal.ROUND_DOWN);
        }
      }
    } else {
      this.VSP3 = this.ZRE4VP.times(this.KVSATZAN.plus(this.PVSATZAN)).toDP(2, Decimal.ROUND_DOWN);
    }
    this.VSP = this.VSP3.plus(this.VSP1).toDP(0, Decimal.ROUND_UP);
  }
  /**
   * Lohnsteuer fuer die Steuerklassen V und VI (§ 39b Abs. 2 Satz 7 EStG)
   * PAP Seite 29 -- IDENTICAL to 2026
   */
  MST5_6() {
    this.ZZX = this.X;
    if (this.ZZX.cmp(this.W2STKL5) === 1) {
      this.ZX = this.W2STKL5;
      this.UP5_6();
      if (this.ZZX.cmp(this.W3STKL5) === 1) {
        this.ST = this.ST.plus(this.W3STKL5.minus(this.W2STKL5).times(new Decimal("0.42"))).toDP(0, Decimal.ROUND_DOWN);
        this.ST = this.ST.plus(this.ZZX.minus(this.W3STKL5).times(new Decimal("0.45"))).toDP(0, Decimal.ROUND_DOWN);
      } else {
        this.ST = this.ST.plus(this.ZZX.minus(this.W2STKL5).times(new Decimal("0.42"))).toDP(0, Decimal.ROUND_DOWN);
      }
    } else {
      this.ZX = this.ZZX;
      this.UP5_6();
      if (this.ZZX.cmp(this.W1STKL5) === 1) {
        this.VERGL = this.ST;
        this.ZX = this.W1STKL5;
        this.UP5_6();
        this.HOCH = this.ST.plus(this.ZZX.minus(this.W1STKL5).times(new Decimal("0.42"))).toDP(0, Decimal.ROUND_DOWN);
        if (this.HOCH.cmp(this.VERGL) === -1) {
          this.ST = this.HOCH;
        } else {
          this.ST = this.VERGL;
        }
      }
    }
  }
  /**
   * Unterprogramm zur Lohnsteuer fuer die Steuerklassen V und VI
   * (§ 39b Abs. 2 Satz 7 EStG)
   * PAP Seite 30
   *
   * DIFFERS FROM 2026: Uses setScale(2, ROUND_DOWN) for X instead of setScale(0, ROUND_DOWN)
   */
  UP5_6() {
    this.X = this.ZX.times(new Decimal("1.25")).toDP(2, Decimal.ROUND_DOWN);
    this.UPTAB25();
    this.ST1 = this.ST;
    this.X = this.ZX.times(new Decimal("0.75")).toDP(2, Decimal.ROUND_DOWN);
    this.UPTAB25();
    this.ST2 = this.ST;
    this.DIFF = this.ST1.minus(this.ST2).times(this.ZAHL2);
    this.MIST = this.ZX.times(new Decimal("0.14")).toDP(0, Decimal.ROUND_DOWN);
    if (this.MIST.cmp(this.DIFF) === 1) {
      this.ST = this.MIST;
    } else {
      this.ST = this.DIFF;
    }
  }
  /**
   * Solidaritaetszuschlag
   * PAP Seite 31 -- IDENTICAL to 2026
   */
  MSOLZ() {
    this.SOLZFREI = this.SOLZFREI.times(new Decimal(this.KZTAB));
    if (this.JBMG.cmp(this.SOLZFREI) === 1) {
      this.SOLZJ = this.JBMG.times(new Decimal("5.5")).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.SOLZMIN = this.JBMG.minus(this.SOLZFREI).times(new Decimal("11.9")).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      if (this.SOLZMIN.cmp(this.SOLZJ) === -1) {
        this.SOLZJ = this.SOLZMIN;
      }
      this.JW = this.SOLZJ.times(this.ZAHL100).toDP(0, Decimal.ROUND_DOWN);
      this.UPANTEIL();
      this.SOLZLZZ = this.ANTEIL1;
    } else {
      this.SOLZLZZ = new Decimal(0);
    }
    if (this.R > 0) {
      this.JW = this.JBMG.times(this.ZAHL100);
      this.UPANTEIL();
      this.BK = this.ANTEIL1;
    } else {
      this.BK = new Decimal(0);
    }
  }
  /**
   * Anteil von Jahresbetraegen fuer einen LZZ (§ 39b Abs. 2 Satz 9 EStG)
   * PAP Seite 32 -- IDENTICAL to 2026
   */
  UPANTEIL() {
    if (this.LZZ === 1) {
      this.ANTEIL1 = this.JW;
    } else if (this.LZZ === 2) {
      this.ANTEIL1 = this.JW.div(this.ZAHL12).toDP(0, Decimal.ROUND_DOWN);
    } else if (this.LZZ === 3) {
      this.ANTEIL1 = this.JW.times(this.ZAHL7).div(this.ZAHL360).toDP(0, Decimal.ROUND_DOWN);
    } else {
      this.ANTEIL1 = this.JW.div(this.ZAHL360).toDP(0, Decimal.ROUND_DOWN);
    }
  }
  /**
   * Berechnung sonstiger Bezuege nach § 39b Abs. 3 Saetze 1 bis 8 EStG
   * PAP Seite 33
   *
   * DIFFERS FROM 2026: Has VKVSONST/VKV handling and additional UPVKV calls
   */
  MSONST() {
    this.LZZ = 1;
    if (this.ZMVB === 0) {
      this.ZMVB = 12;
    }
    if (this.SONSTB.cmp(new Decimal(0)) === 0 && this.MBV.cmp(new Decimal(0)) === 0) {
      this.VKVSONST = new Decimal(0);
      this.LSTSO = new Decimal(0);
      this.STS = new Decimal(0);
      this.SOLZS = new Decimal(0);
      this.BKS = new Decimal(0);
    } else {
      this.MOSONST();
      this.UPVKV();
      this.VKVSONST = this.VKV;
      this.ZRE4J = this.JRE4.plus(this.SONSTB).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.ZVBEZJ = this.JVBEZ.plus(this.VBS).div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      this.VBEZBSO = this.STERBE;
      this.MRE4SONST();
      this.MLSTJAHR();
      this.WVFRBM = this.ZVE.minus(this.GFB).times(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
      if (this.WVFRBM.cmp(new Decimal(0)) === -1) {
        this.WVFRBM = new Decimal(0);
      }
      this.UPVKV();
      this.VKVSONST = this.VKV.minus(this.VKVSONST);
      this.LSTSO = this.ST.times(this.ZAHL100);
      this.STS = this.LSTSO.minus(this.LSTOSO).times(new Decimal(this.f)).div(this.ZAHL100).toDP(0, Decimal.ROUND_DOWN).times(this.ZAHL100);
      this.STSMIN();
    }
  }
  /**
   * PAP Seite 34 -- IDENTICAL to 2026
   */
  STSMIN() {
    if (this.STS.cmp(new Decimal(0)) === -1) {
      if (this.MBV.cmp(new Decimal(0)) === 0) {
      } else {
        this.LSTLZZ = this.LSTLZZ.plus(this.STS);
        if (this.LSTLZZ.cmp(new Decimal(0)) === -1) {
          this.LSTLZZ = new Decimal(0);
        }
        this.SOLZLZZ = this.SOLZLZZ.plus(this.STS.times(new Decimal("5.5").div(this.ZAHL100))).toDP(0, Decimal.ROUND_DOWN);
        if (this.SOLZLZZ.cmp(new Decimal(0)) === -1) {
          this.SOLZLZZ = new Decimal(0);
        }
        this.BK = this.BK.plus(this.STS);
        if (this.BK.cmp(new Decimal(0)) === -1) {
          this.BK = new Decimal(0);
        }
      }
      this.STS = new Decimal(0);
      this.SOLZS = new Decimal(0);
    } else {
      this.MSOLZSTS();
    }
    if (this.R > 0) {
      this.BKS = this.STS;
    } else {
      this.BKS = new Decimal(0);
    }
  }
  /**
   * Berechnung des SolZ auf sonstige Bezüge
   * PAP Seite 35
   */
  MSOLZSTS() {
    if (this.ZKF.cmp(new Decimal(0)) === 1) {
      this.SOLZSZVE = this.ZVE.minus(this.KFB);
    } else {
      this.SOLZSZVE = this.ZVE;
    }
    if (this.SOLZSZVE.cmp(new Decimal(1)) === -1) {
      this.SOLZSZVE = new Decimal(0);
      this.X = new Decimal(0);
    } else {
      this.X = this.SOLZSZVE.div(new Decimal(this.KZTAB)).toDP(0, Decimal.ROUND_DOWN);
    }
    if (this.STKL < 5) {
      this.UPTAB25();
    } else {
      this.MST5_6();
    }
    this.SOLZSBMG = this.ST.times(new Decimal(this.f)).toDP(0, Decimal.ROUND_DOWN);
    if (this.SOLZSBMG.cmp(this.SOLZFREI) === 1) {
      this.SOLZS = this.STS.times(new Decimal("5.5")).div(this.ZAHL100).toDP(0, Decimal.ROUND_DOWN);
    } else {
      this.SOLZS = new Decimal(0);
    }
  }
  /**
   * Sonderberechnung ohne sonstige Bezüge für Berechnung bei sonstigen Bezügen
   * PAP Seite 36 -- IDENTICAL to 2026
   */
  MOSONST() {
    this.ZRE4J = this.JRE4.div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    this.ZVBEZJ = this.JVBEZ.div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    this.JLFREIB = this.JFREIB.div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    this.JLHINZU = this.JHINZU.div(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    this.MRE4();
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.minus(this.JRE4ENT.div(this.ZAHL100));
    this.MZTABFB();
    this.VFRBS1 = this.ANP.plus(this.FVB.plus(this.FVBZ)).times(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRBO = this.ZVE.minus(this.GFB).times(this.ZAHL100).toDP(2, Decimal.ROUND_DOWN);
    if (this.WVFRBO.cmp(new Decimal(0)) === -1) {
      this.WVFRBO = new Decimal(0);
    }
    this.LSTOSO = this.ST.times(this.ZAHL100);
  }
  /**
   * Sonderberechnung mit sonstige Bezüge für Berechnung bei sonstigen Bezügen
   * PAP Seite 37 -- IDENTICAL to 2026
   */
  MRE4SONST() {
    this.MRE4();
    this.FVB = this.FVBSO;
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.plus(this.MBV.div(this.ZAHL100)).minus(this.JRE4ENT.div(this.ZAHL100)).minus(this.SONSTENT.div(this.ZAHL100));
    this.FVBZ = this.FVBZSO;
    this.MZTABFB();
    this.VFRBS2 = this.ANP.plus(this.FVB).plus(this.FVBZ).times(this.ZAHL100).minus(this.VFRBS1);
  }
  /**
   * Tarifliche Einkommensteuer §32a EStG
   * PAP Seite 38
   *
   * DIFFERS FROM 2026: Different thresholds and coefficients:
   * - Zone 2 upper:  17444 (2025) vs 17800 (2026)
   * - Zone 2 coeff:  932.30 (2025) vs 914.51 (2026)
   * - Zone 3 upper:  68481 (2025) vs 69879 (2026)
   * - Zone 3 base:   17443 (2025) vs 17799 (2026)
   * - Zone 3 coeff:  176.64 (2025) vs 173.1 (2026)
   * - Zone 3 const:  1015.13 (2025) vs 1034.87 (2026)
   * - Zone 4 const:  10911.92 (2025) vs 11135.63 (2026)
   * - Zone 5 const:  19246.67 (2025) vs 19470.38 (2026)
   * - Zone 4/5 boundary: 277826 (same both years)
   */
  UPTAB25() {
    if (this.X.cmp(this.GFB.plus(this.ZAHL1)) === -1) {
      this.ST = new Decimal(0);
    } else if (this.X.cmp(new Decimal(17444)) === -1) {
      this.Y = this.X.minus(this.GFB).div(this.ZAHL10000).toDP(6, Decimal.ROUND_DOWN);
      this.RW = this.Y.times(new Decimal("932.30"));
      this.RW = this.RW.plus(new Decimal(1400));
      this.ST = this.RW.times(this.Y).toDP(0, Decimal.ROUND_DOWN);
    } else if (this.X.cmp(new Decimal(68481)) === -1) {
      this.Y = this.X.minus(new Decimal(17443)).div(this.ZAHL10000).toDP(6, Decimal.ROUND_DOWN);
      this.RW = this.Y.times(new Decimal("176.64"));
      this.RW = this.RW.plus(new Decimal(2397));
      this.RW = this.RW.times(this.Y);
      this.ST = this.RW.plus(new Decimal("1015.13")).toDP(0, Decimal.ROUND_DOWN);
    } else if (this.X.cmp(new Decimal(277826)) === -1) {
      this.ST = this.X.times(new Decimal("0.42")).minus(new Decimal("10911.92")).toDP(0, Decimal.ROUND_DOWN);
    } else {
      this.ST = this.X.times(new Decimal("0.45")).minus(new Decimal("19246.67")).toDP(0, Decimal.ROUND_DOWN);
    }
    this.ST = this.ST.times(new Decimal(this.KZTAB));
  }
};

// src/core/pap2026.ts
import Decimal2 from "decimal.js";
var Pap2026 = class {
  // -------------------------------------------------------------------------
  // Inputs: BigDecimal type -> Decimal
  // -------------------------------------------------------------------------
  RE4 = new Decimal2(0);
  VBEZ = new Decimal2(0);
  VBEZM = new Decimal2(0);
  VBEZS = new Decimal2(0);
  VBS = new Decimal2(0);
  LZZFREIB = new Decimal2(0);
  LZZHINZU = new Decimal2(0);
  JFREIB = new Decimal2(0);
  JHINZU = new Decimal2(0);
  JRE4 = new Decimal2(0);
  JRE4ENT = new Decimal2(0);
  JVBEZ = new Decimal2(0);
  SONSTB = new Decimal2(0);
  SONSTENT = new Decimal2(0);
  STERBE = new Decimal2(0);
  KVZ = new Decimal2(0);
  PVA = new Decimal2(0);
  PKPV = new Decimal2(0);
  PKPVAGZ = new Decimal2(0);
  MBV = new Decimal2(0);
  ZKF = new Decimal2(0);
  // -------------------------------------------------------------------------
  // Inputs: int type -> number
  // -------------------------------------------------------------------------
  af = 1;
  AJAHR = 0;
  ALTER1 = 0;
  ALV = 0;
  KRV = 0;
  LZZ = 1;
  PKV = 0;
  PVS = 0;
  PVZ = 0;
  R = 0;
  STKL = 1;
  VJAHR = 0;
  ZMVB = 0;
  // -------------------------------------------------------------------------
  // Inputs: double type -> number
  // -------------------------------------------------------------------------
  f = 1;
  // -------------------------------------------------------------------------
  // Outputs: all BigDecimal -> Decimal
  // -------------------------------------------------------------------------
  BK = new Decimal2(0);
  BKS = new Decimal2(0);
  LSTLZZ = new Decimal2(0);
  SOLZLZZ = new Decimal2(0);
  SOLZS = new Decimal2(0);
  STS = new Decimal2(0);
  VFRB = new Decimal2(0);
  VFRBS1 = new Decimal2(0);
  VFRBS2 = new Decimal2(0);
  WVFRB = new Decimal2(0);
  WVFRBO = new Decimal2(0);
  WVFRBM = new Decimal2(0);
  // -------------------------------------------------------------------------
  // Internals: BigDecimal -> Decimal
  // -------------------------------------------------------------------------
  ALTE = new Decimal2(0);
  ANP = new Decimal2(0);
  ANTEIL1 = new Decimal2(0);
  AVSATZAN = new Decimal2(0);
  BBGKVPV = new Decimal2(0);
  BBGRVALV = new Decimal2(0);
  BMG = new Decimal2(0);
  DIFF = new Decimal2(0);
  EFA = new Decimal2(0);
  FVB = new Decimal2(0);
  FVBSO = new Decimal2(0);
  FVBZ = new Decimal2(0);
  FVBZSO = new Decimal2(0);
  GFB = new Decimal2(0);
  HBALTE = new Decimal2(0);
  HFVB = new Decimal2(0);
  HFVBZ = new Decimal2(0);
  HFVBZSO = new Decimal2(0);
  HOCH = new Decimal2(0);
  JBMG = new Decimal2(0);
  JLFREIB = new Decimal2(0);
  JLHINZU = new Decimal2(0);
  JW = new Decimal2(0);
  KFB = new Decimal2(0);
  KVSATZAN = new Decimal2(0);
  LSTJAHR = new Decimal2(0);
  LSTOSO = new Decimal2(0);
  LSTSO = new Decimal2(0);
  MIST = new Decimal2(0);
  PKPVAGZJ = new Decimal2(0);
  PVSATZAN = new Decimal2(0);
  RVSATZAN = new Decimal2(0);
  RW = new Decimal2(0);
  SAP = new Decimal2(0);
  SOLZFREI = new Decimal2(0);
  SOLZJ = new Decimal2(0);
  SOLZMIN = new Decimal2(0);
  SOLZSBMG = new Decimal2(0);
  SOLZSZVE = new Decimal2(0);
  ST = new Decimal2(0);
  ST1 = new Decimal2(0);
  ST2 = new Decimal2(0);
  VBEZB = new Decimal2(0);
  VBEZBSO = new Decimal2(0);
  VERGL = new Decimal2(0);
  VSPHB = new Decimal2(0);
  VSP = new Decimal2(0);
  VSPN = new Decimal2(0);
  VSPALV = new Decimal2(0);
  VSPKVPV = new Decimal2(0);
  VSPR = new Decimal2(0);
  W1STKL5 = new Decimal2(0);
  W2STKL5 = new Decimal2(0);
  W3STKL5 = new Decimal2(0);
  X = new Decimal2(0);
  Y = new Decimal2(0);
  ZRE4 = new Decimal2(0);
  ZRE4J = new Decimal2(0);
  ZRE4VP = new Decimal2(0);
  ZRE4VPR = new Decimal2(0);
  ZTABFB = new Decimal2(0);
  ZVBEZ = new Decimal2(0);
  ZVBEZJ = new Decimal2(0);
  ZVE = new Decimal2(0);
  ZX = new Decimal2(0);
  ZZX = new Decimal2(0);
  // -------------------------------------------------------------------------
  // Internals: int -> number
  // -------------------------------------------------------------------------
  J = 0;
  K = 0;
  KZTAB = 0;
  // -------------------------------------------------------------------------
  // Constants: TAB1-TAB5 (index 0..54)
  // -------------------------------------------------------------------------
  TAB1 = [
    new Decimal2(0),
    new Decimal2("0.4"),
    new Decimal2("0.384"),
    new Decimal2("0.368"),
    new Decimal2("0.352"),
    new Decimal2("0.336"),
    new Decimal2("0.32"),
    new Decimal2("0.304"),
    new Decimal2("0.288"),
    new Decimal2("0.272"),
    new Decimal2("0.256"),
    new Decimal2("0.24"),
    new Decimal2("0.224"),
    new Decimal2("0.208"),
    new Decimal2("0.192"),
    new Decimal2("0.176"),
    new Decimal2("0.16"),
    new Decimal2("0.152"),
    new Decimal2("0.144"),
    new Decimal2("0.14"),
    new Decimal2("0.136"),
    new Decimal2("0.132"),
    new Decimal2("0.128"),
    new Decimal2("0.124"),
    new Decimal2("0.12"),
    new Decimal2("0.116"),
    new Decimal2("0.112"),
    new Decimal2("0.108"),
    new Decimal2("0.104"),
    new Decimal2("0.1"),
    new Decimal2("0.096"),
    new Decimal2("0.092"),
    new Decimal2("0.088"),
    new Decimal2("0.084"),
    new Decimal2("0.08"),
    new Decimal2("0.076"),
    new Decimal2("0.072"),
    new Decimal2("0.068"),
    new Decimal2("0.064"),
    new Decimal2("0.06"),
    new Decimal2("0.056"),
    new Decimal2("0.052"),
    new Decimal2("0.048"),
    new Decimal2("0.044"),
    new Decimal2("0.04"),
    new Decimal2("0.036"),
    new Decimal2("0.032"),
    new Decimal2("0.028"),
    new Decimal2("0.024"),
    new Decimal2("0.02"),
    new Decimal2("0.016"),
    new Decimal2("0.012"),
    new Decimal2("0.008"),
    new Decimal2("0.004"),
    new Decimal2(0)
  ];
  TAB2 = [
    new Decimal2(0),
    new Decimal2(3e3),
    new Decimal2(2880),
    new Decimal2(2760),
    new Decimal2(2640),
    new Decimal2(2520),
    new Decimal2(2400),
    new Decimal2(2280),
    new Decimal2(2160),
    new Decimal2(2040),
    new Decimal2(1920),
    new Decimal2(1800),
    new Decimal2(1680),
    new Decimal2(1560),
    new Decimal2(1440),
    new Decimal2(1320),
    new Decimal2(1200),
    new Decimal2(1140),
    new Decimal2(1080),
    new Decimal2(1050),
    new Decimal2(1020),
    new Decimal2(990),
    new Decimal2(960),
    new Decimal2(930),
    new Decimal2(900),
    new Decimal2(870),
    new Decimal2(840),
    new Decimal2(810),
    new Decimal2(780),
    new Decimal2(750),
    new Decimal2(720),
    new Decimal2(690),
    new Decimal2(660),
    new Decimal2(630),
    new Decimal2(600),
    new Decimal2(570),
    new Decimal2(540),
    new Decimal2(510),
    new Decimal2(480),
    new Decimal2(450),
    new Decimal2(420),
    new Decimal2(390),
    new Decimal2(360),
    new Decimal2(330),
    new Decimal2(300),
    new Decimal2(270),
    new Decimal2(240),
    new Decimal2(210),
    new Decimal2(180),
    new Decimal2(150),
    new Decimal2(120),
    new Decimal2(90),
    new Decimal2(60),
    new Decimal2(30),
    new Decimal2(0)
  ];
  TAB3 = [
    new Decimal2(0),
    new Decimal2(900),
    new Decimal2(864),
    new Decimal2(828),
    new Decimal2(792),
    new Decimal2(756),
    new Decimal2(720),
    new Decimal2(684),
    new Decimal2(648),
    new Decimal2(612),
    new Decimal2(576),
    new Decimal2(540),
    new Decimal2(504),
    new Decimal2(468),
    new Decimal2(432),
    new Decimal2(396),
    new Decimal2(360),
    new Decimal2(342),
    new Decimal2(324),
    new Decimal2(315),
    new Decimal2(306),
    new Decimal2(297),
    new Decimal2(288),
    new Decimal2(279),
    new Decimal2(270),
    new Decimal2(261),
    new Decimal2(252),
    new Decimal2(243),
    new Decimal2(234),
    new Decimal2(225),
    new Decimal2(216),
    new Decimal2(207),
    new Decimal2(198),
    new Decimal2(189),
    new Decimal2(180),
    new Decimal2(171),
    new Decimal2(162),
    new Decimal2(153),
    new Decimal2(144),
    new Decimal2(135),
    new Decimal2(126),
    new Decimal2(117),
    new Decimal2(108),
    new Decimal2(99),
    new Decimal2(90),
    new Decimal2(81),
    new Decimal2(72),
    new Decimal2(63),
    new Decimal2(54),
    new Decimal2(45),
    new Decimal2(36),
    new Decimal2(27),
    new Decimal2(18),
    new Decimal2(9),
    new Decimal2(0)
  ];
  TAB4 = [
    new Decimal2(0),
    new Decimal2("0.4"),
    new Decimal2("0.384"),
    new Decimal2("0.368"),
    new Decimal2("0.352"),
    new Decimal2("0.336"),
    new Decimal2("0.32"),
    new Decimal2("0.304"),
    new Decimal2("0.288"),
    new Decimal2("0.272"),
    new Decimal2("0.256"),
    new Decimal2("0.24"),
    new Decimal2("0.224"),
    new Decimal2("0.208"),
    new Decimal2("0.192"),
    new Decimal2("0.176"),
    new Decimal2("0.16"),
    new Decimal2("0.152"),
    new Decimal2("0.144"),
    new Decimal2("0.14"),
    new Decimal2("0.136"),
    new Decimal2("0.132"),
    new Decimal2("0.128"),
    new Decimal2("0.124"),
    new Decimal2("0.12"),
    new Decimal2("0.116"),
    new Decimal2("0.112"),
    new Decimal2("0.108"),
    new Decimal2("0.104"),
    new Decimal2("0.1"),
    new Decimal2("0.096"),
    new Decimal2("0.092"),
    new Decimal2("0.088"),
    new Decimal2("0.084"),
    new Decimal2("0.08"),
    new Decimal2("0.076"),
    new Decimal2("0.072"),
    new Decimal2("0.068"),
    new Decimal2("0.064"),
    new Decimal2("0.06"),
    new Decimal2("0.056"),
    new Decimal2("0.052"),
    new Decimal2("0.048"),
    new Decimal2("0.044"),
    new Decimal2("0.04"),
    new Decimal2("0.036"),
    new Decimal2("0.032"),
    new Decimal2("0.028"),
    new Decimal2("0.024"),
    new Decimal2("0.02"),
    new Decimal2("0.016"),
    new Decimal2("0.012"),
    new Decimal2("0.008"),
    new Decimal2("0.004"),
    new Decimal2(0)
  ];
  TAB5 = [
    new Decimal2(0),
    new Decimal2(1900),
    new Decimal2(1824),
    new Decimal2(1748),
    new Decimal2(1672),
    new Decimal2(1596),
    new Decimal2(1520),
    new Decimal2(1444),
    new Decimal2(1368),
    new Decimal2(1292),
    new Decimal2(1216),
    new Decimal2(1140),
    new Decimal2(1064),
    new Decimal2(988),
    new Decimal2(912),
    new Decimal2(836),
    new Decimal2(760),
    new Decimal2(722),
    new Decimal2(684),
    new Decimal2(665),
    new Decimal2(646),
    new Decimal2(627),
    new Decimal2(608),
    new Decimal2(589),
    new Decimal2(570),
    new Decimal2(551),
    new Decimal2(532),
    new Decimal2(513),
    new Decimal2(494),
    new Decimal2(475),
    new Decimal2(456),
    new Decimal2(437),
    new Decimal2(418),
    new Decimal2(399),
    new Decimal2(380),
    new Decimal2(361),
    new Decimal2(342),
    new Decimal2(323),
    new Decimal2(304),
    new Decimal2(285),
    new Decimal2(266),
    new Decimal2(247),
    new Decimal2(228),
    new Decimal2(209),
    new Decimal2(190),
    new Decimal2(171),
    new Decimal2(152),
    new Decimal2(133),
    new Decimal2(114),
    new Decimal2(95),
    new Decimal2(76),
    new Decimal2(57),
    new Decimal2(38),
    new Decimal2(19),
    new Decimal2(0)
  ];
  // -------------------------------------------------------------------------
  // ZAHL constants
  // -------------------------------------------------------------------------
  ZAHL1 = new Decimal2(1);
  ZAHL2 = new Decimal2(2);
  ZAHL5 = new Decimal2(5);
  ZAHL7 = new Decimal2(7);
  ZAHL12 = new Decimal2(12);
  ZAHL100 = new Decimal2(100);
  ZAHL360 = new Decimal2(360);
  ZAHL500 = new Decimal2(500);
  ZAHL700 = new Decimal2(700);
  ZAHL1000 = new Decimal2(1e3);
  ZAHL10000 = new Decimal2(1e4);
  // =========================================================================
  // Public API
  // =========================================================================
  setInputs(inputs) {
    const merged = { ...INPUT_DEFAULTS, ...inputs };
    this.RE4 = new Decimal2(merged.RE4);
    this.VBEZ = new Decimal2(merged.VBEZ);
    this.VBEZM = new Decimal2(merged.VBEZM);
    this.VBEZS = new Decimal2(merged.VBEZS);
    this.VBS = new Decimal2(merged.VBS);
    this.LZZFREIB = new Decimal2(merged.LZZFREIB);
    this.LZZHINZU = new Decimal2(merged.LZZHINZU);
    this.JFREIB = new Decimal2(merged.JFREIB);
    this.JHINZU = new Decimal2(merged.JHINZU);
    this.JRE4 = new Decimal2(merged.JRE4);
    this.JRE4ENT = new Decimal2(merged.JRE4ENT);
    this.JVBEZ = new Decimal2(merged.JVBEZ);
    this.SONSTB = new Decimal2(merged.SONSTB);
    this.SONSTENT = new Decimal2(merged.SONSTENT);
    this.STERBE = new Decimal2(merged.STERBE);
    this.KVZ = new Decimal2(merged.KVZ);
    this.PVA = new Decimal2(merged.PVA);
    this.PKPV = new Decimal2(merged.PKPV);
    this.PKPVAGZ = new Decimal2(merged.PKPVAGZ);
    this.MBV = new Decimal2(merged.MBV);
    this.ZKF = new Decimal2(merged.ZKF);
    this.af = merged.af;
    this.AJAHR = merged.AJAHR;
    this.ALTER1 = merged.ALTER1;
    this.ALV = merged.ALV;
    this.KRV = merged.KRV;
    this.LZZ = merged.LZZ;
    this.PKV = merged.PKV;
    this.PVS = merged.PVS;
    this.PVZ = merged.PVZ;
    this.R = merged.R;
    this.STKL = merged.STKL;
    this.VJAHR = merged.VJAHR;
    this.ZMVB = merged.ZMVB;
    this.f = merged.f;
    this.BK = new Decimal2(0);
    this.BKS = new Decimal2(0);
    this.LSTLZZ = new Decimal2(0);
    this.SOLZLZZ = new Decimal2(0);
    this.SOLZS = new Decimal2(0);
    this.STS = new Decimal2(0);
    this.VFRB = new Decimal2(0);
    this.VFRBS1 = new Decimal2(0);
    this.VFRBS2 = new Decimal2(0);
    this.WVFRB = new Decimal2(0);
    this.WVFRBO = new Decimal2(0);
    this.WVFRBM = new Decimal2(0);
    this.ALTE = new Decimal2(0);
    this.ANP = new Decimal2(0);
    this.ANTEIL1 = new Decimal2(0);
    this.AVSATZAN = new Decimal2(0);
    this.BBGKVPV = new Decimal2(0);
    this.BBGRVALV = new Decimal2(0);
    this.BMG = new Decimal2(0);
    this.DIFF = new Decimal2(0);
    this.EFA = new Decimal2(0);
    this.FVB = new Decimal2(0);
    this.FVBSO = new Decimal2(0);
    this.FVBZ = new Decimal2(0);
    this.FVBZSO = new Decimal2(0);
    this.GFB = new Decimal2(0);
    this.HBALTE = new Decimal2(0);
    this.HFVB = new Decimal2(0);
    this.HFVBZ = new Decimal2(0);
    this.HFVBZSO = new Decimal2(0);
    this.HOCH = new Decimal2(0);
    this.J = 0;
    this.JBMG = new Decimal2(0);
    this.JLFREIB = new Decimal2(0);
    this.JLHINZU = new Decimal2(0);
    this.JW = new Decimal2(0);
    this.K = 0;
    this.KFB = new Decimal2(0);
    this.KVSATZAN = new Decimal2(0);
    this.KZTAB = 0;
    this.LSTJAHR = new Decimal2(0);
    this.LSTOSO = new Decimal2(0);
    this.LSTSO = new Decimal2(0);
    this.MIST = new Decimal2(0);
    this.PKPVAGZJ = new Decimal2(0);
    this.PVSATZAN = new Decimal2(0);
    this.RVSATZAN = new Decimal2(0);
    this.RW = new Decimal2(0);
    this.SAP = new Decimal2(0);
    this.SOLZFREI = new Decimal2(0);
    this.SOLZJ = new Decimal2(0);
    this.SOLZMIN = new Decimal2(0);
    this.SOLZSBMG = new Decimal2(0);
    this.SOLZSZVE = new Decimal2(0);
    this.ST = new Decimal2(0);
    this.ST1 = new Decimal2(0);
    this.ST2 = new Decimal2(0);
    this.VBEZB = new Decimal2(0);
    this.VBEZBSO = new Decimal2(0);
    this.VERGL = new Decimal2(0);
    this.VSPHB = new Decimal2(0);
    this.VSP = new Decimal2(0);
    this.VSPN = new Decimal2(0);
    this.VSPALV = new Decimal2(0);
    this.VSPKVPV = new Decimal2(0);
    this.VSPR = new Decimal2(0);
    this.W1STKL5 = new Decimal2(0);
    this.W2STKL5 = new Decimal2(0);
    this.W3STKL5 = new Decimal2(0);
    this.X = new Decimal2(0);
    this.Y = new Decimal2(0);
    this.ZRE4 = new Decimal2(0);
    this.ZRE4J = new Decimal2(0);
    this.ZRE4VP = new Decimal2(0);
    this.ZRE4VPR = new Decimal2(0);
    this.ZTABFB = new Decimal2(0);
    this.ZVBEZ = new Decimal2(0);
    this.ZVBEZJ = new Decimal2(0);
    this.ZVE = new Decimal2(0);
    this.ZX = new Decimal2(0);
    this.ZZX = new Decimal2(0);
  }
  calculate() {
    this.MPARA();
    this.MRE4JL();
    this.VBEZBSO = new Decimal2(0);
    this.MRE4();
    this.MRE4ABZ();
    this.MBERECH();
    this.MSONST();
  }
  getOutputs() {
    return {
      BK: this.BK.trunc().toNumber(),
      BKS: this.BKS.trunc().toNumber(),
      LSTLZZ: this.LSTLZZ.trunc().toNumber(),
      SOLZLZZ: this.SOLZLZZ.trunc().toNumber(),
      SOLZS: this.SOLZS.trunc().toNumber(),
      STS: this.STS.trunc().toNumber(),
      VFRB: this.VFRB.trunc().toNumber(),
      VFRBS1: this.VFRBS1.trunc().toNumber(),
      VFRBS2: this.VFRBS2.trunc().toNumber(),
      WVFRB: this.WVFRB.trunc().toNumber(),
      WVFRBO: this.WVFRBO.trunc().toNumber(),
      WVFRBM: this.WVFRBM.trunc().toNumber()
    };
  }
  // =========================================================================
  // PAP Methods
  // =========================================================================
  /**
   * Zuweisung von Werten für bestimmte Steuer- und Sozialversicherungsparameter
   * PAP Seite 14
   */
  MPARA() {
    this.BBGRVALV = new Decimal2(101400);
    this.AVSATZAN = new Decimal2("0.013");
    this.RVSATZAN = new Decimal2("0.093");
    this.BBGKVPV = new Decimal2(69750);
    this.KVSATZAN = this.KVZ.div(this.ZAHL2).div(this.ZAHL100).plus(new Decimal2("0.07"));
    if (this.PVS === 1) {
      this.PVSATZAN = new Decimal2("0.023");
    } else {
      this.PVSATZAN = new Decimal2("0.018");
    }
    if (this.PVZ === 1) {
      this.PVSATZAN = this.PVSATZAN.plus(new Decimal2("0.006"));
    } else {
      this.PVSATZAN = this.PVSATZAN.minus(this.PVA.times(new Decimal2("0.0025")));
    }
    this.W1STKL5 = new Decimal2(14071);
    this.W2STKL5 = new Decimal2(34939);
    this.W3STKL5 = new Decimal2(222260);
    this.GFB = new Decimal2(12348);
    this.SOLZFREI = new Decimal2(20350);
  }
  /**
   * Ermittlung des Jahresarbeitslohns nach § 39 b Absatz 2 Satz 2 EStG
   * PAP Seite 15
   */
  MRE4JL() {
    if (this.LZZ === 1) {
      this.ZRE4J = this.RE4.div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    } else if (this.LZZ === 2) {
      this.ZRE4J = this.RE4.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    } else if (this.LZZ === 3) {
      this.ZRE4J = this.RE4.times(this.ZAHL360).div(this.ZAHL700).toDP(2, Decimal2.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.times(this.ZAHL360).div(this.ZAHL700).toDP(2, Decimal2.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.times(this.ZAHL360).div(this.ZAHL700).toDP(2, Decimal2.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.times(this.ZAHL360).div(this.ZAHL700).toDP(2, Decimal2.ROUND_DOWN);
    } else {
      this.ZRE4J = this.RE4.times(this.ZAHL360).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.times(this.ZAHL360).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.times(this.ZAHL360).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.times(this.ZAHL360).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    }
    if (this.af === 0) {
      this.f = 1;
    }
  }
  /**
   * Freibeträge für Versorgungsbezüge, Altersentlastungsbetrag
   * (§ 39b Absatz 2 Satz 3 EStG)
   * PAP Seite 16
   */
  MRE4() {
    if (this.ZVBEZJ.cmp(new Decimal2(0)) === 0) {
      this.FVBZ = new Decimal2(0);
      this.FVB = new Decimal2(0);
      this.FVBZSO = new Decimal2(0);
      this.FVBSO = new Decimal2(0);
    } else {
      if (this.VJAHR < 2006) {
        this.J = 1;
      } else if (this.VJAHR < 2058) {
        this.J = this.VJAHR - 2004;
      } else {
        this.J = 54;
      }
      if (this.LZZ === 1) {
        this.VBEZB = this.VBEZM.times(new Decimal2(this.ZMVB)).plus(this.VBEZS);
        this.HFVB = this.TAB2[this.J].div(this.ZAHL12).times(new Decimal2(this.ZMVB)).toDP(0, Decimal2.ROUND_UP);
        this.FVBZ = this.TAB3[this.J].div(this.ZAHL12).times(new Decimal2(this.ZMVB)).toDP(0, Decimal2.ROUND_UP);
      } else {
        this.VBEZB = this.VBEZM.times(this.ZAHL12).plus(this.VBEZS).toDP(2, Decimal2.ROUND_DOWN);
        this.HFVB = this.TAB2[this.J];
        this.FVBZ = this.TAB3[this.J];
      }
      this.FVB = this.VBEZB.times(this.TAB1[this.J]).div(this.ZAHL100).toDP(2, Decimal2.ROUND_UP);
      if (this.FVB.cmp(this.HFVB) === 1) {
        this.FVB = this.HFVB;
      }
      if (this.FVB.cmp(this.ZVBEZJ) === 1) {
        this.FVB = this.ZVBEZJ;
      }
      this.FVBSO = this.FVB.plus(this.VBEZBSO.times(this.TAB1[this.J]).div(this.ZAHL100)).toDP(2, Decimal2.ROUND_UP);
      if (this.FVBSO.cmp(this.TAB2[this.J]) === 1) {
        this.FVBSO = this.TAB2[this.J];
      }
      this.HFVBZSO = this.VBEZB.plus(this.VBEZBSO).div(this.ZAHL100).minus(this.FVBSO).toDP(2, Decimal2.ROUND_DOWN);
      this.FVBZSO = this.FVBZ.plus(this.VBEZBSO.div(this.ZAHL100)).toDP(0, Decimal2.ROUND_UP);
      if (this.FVBZSO.cmp(this.HFVBZSO) === 1) {
        this.FVBZSO = this.HFVBZSO.toDP(0, Decimal2.ROUND_UP);
      }
      if (this.FVBZSO.cmp(this.TAB3[this.J]) === 1) {
        this.FVBZSO = this.TAB3[this.J];
      }
      this.HFVBZ = this.VBEZB.div(this.ZAHL100).minus(this.FVB).toDP(2, Decimal2.ROUND_DOWN);
      if (this.FVBZ.cmp(this.HFVBZ) === 1) {
        this.FVBZ = this.HFVBZ.toDP(0, Decimal2.ROUND_UP);
      }
    }
    this.MRE4ALTE();
  }
  /**
   * Altersentlastungsbetrag (§ 39b Absatz 2 Satz 3 EStG)
   * PAP Seite 17
   */
  MRE4ALTE() {
    if (this.ALTER1 === 0) {
      this.ALTE = new Decimal2(0);
    } else {
      if (this.AJAHR < 2006) {
        this.K = 1;
      } else if (this.AJAHR < 2058) {
        this.K = this.AJAHR - 2004;
      } else {
        this.K = 54;
      }
      this.BMG = this.ZRE4J.minus(this.ZVBEZJ);
      this.ALTE = this.BMG.times(this.TAB4[this.K]).toDP(0, Decimal2.ROUND_UP);
      this.HBALTE = this.TAB5[this.K];
      if (this.ALTE.cmp(this.HBALTE) === 1) {
        this.ALTE = this.HBALTE;
      }
    }
  }
  /**
   * Ermittlung des Jahresarbeitslohns nach Abzug der Freibeträge
   * nach § 39 b Absatz 2 Satz 3 und 4 EStG
   * PAP Seite 20
   */
  MRE4ABZ() {
    this.ZRE4 = this.ZRE4J.minus(this.FVB).minus(this.ALTE).minus(this.JLFREIB).plus(this.JLHINZU).toDP(2, Decimal2.ROUND_DOWN);
    if (this.ZRE4.cmp(new Decimal2(0)) === -1) {
      this.ZRE4 = new Decimal2(0);
    }
    this.ZRE4VP = this.ZRE4J;
    this.ZVBEZ = this.ZVBEZJ.minus(this.FVB).toDP(2, Decimal2.ROUND_DOWN);
    if (this.ZVBEZ.cmp(new Decimal2(0)) === -1) {
      this.ZVBEZ = new Decimal2(0);
    }
  }
  /**
   * Berechnung fuer laufende Lohnzahlungszeitraueme
   * PAP Seite 21
   */
  MBERECH() {
    this.MZTABFB();
    this.VFRB = this.ANP.plus(this.FVB.plus(this.FVBZ)).times(this.ZAHL100).toDP(0, Decimal2.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRB = this.ZVE.minus(this.GFB).times(this.ZAHL100).toDP(0, Decimal2.ROUND_DOWN);
    if (this.WVFRB.cmp(new Decimal2(0)) === -1) {
      this.WVFRB = new Decimal2(0);
    }
    this.LSTJAHR = this.ST.times(new Decimal2(this.f)).toDP(0, Decimal2.ROUND_DOWN);
    this.UPLSTLZZ();
    if (this.ZKF.cmp(new Decimal2(0)) === 1) {
      this.ZTABFB = this.ZTABFB.plus(this.KFB);
      this.MRE4ABZ();
      this.MLSTJAHR();
      this.JBMG = this.ST.times(new Decimal2(this.f)).toDP(0, Decimal2.ROUND_DOWN);
    } else {
      this.JBMG = this.LSTJAHR;
    }
    this.MSOLZ();
  }
  /**
   * Ermittlung der festen Tabellenfreibeträge (ohne Vorsorgepauschale)
   * PAP Seite 22
   */
  MZTABFB() {
    this.ANP = new Decimal2(0);
    if (this.ZVBEZ.cmp(new Decimal2(0)) >= 0 && this.ZVBEZ.cmp(this.FVBZ) === -1) {
      this.FVBZ = new Decimal2(this.ZVBEZ.trunc().toNumber());
    }
    if (this.STKL < 6) {
      if (this.ZVBEZ.cmp(new Decimal2(0)) === 1) {
        if (this.ZVBEZ.minus(this.FVBZ).cmp(new Decimal2(102)) === -1) {
          this.ANP = this.ZVBEZ.minus(this.FVBZ).toDP(0, Decimal2.ROUND_UP);
        } else {
          this.ANP = new Decimal2(102);
        }
      }
    } else {
      this.FVBZ = new Decimal2(0);
      this.FVBZSO = new Decimal2(0);
    }
    if (this.STKL < 6) {
      if (this.ZRE4.cmp(this.ZVBEZ) === 1) {
        if (this.ZRE4.minus(this.ZVBEZ).cmp(new Decimal2(1230)) === -1) {
          this.ANP = this.ANP.plus(this.ZRE4).minus(this.ZVBEZ).toDP(0, Decimal2.ROUND_UP);
        } else {
          this.ANP = this.ANP.plus(new Decimal2(1230));
        }
      }
    }
    this.KZTAB = 1;
    if (this.STKL === 1) {
      this.SAP = new Decimal2(36);
      this.KFB = this.ZKF.times(new Decimal2(9756)).toDP(0, Decimal2.ROUND_DOWN);
    } else if (this.STKL === 2) {
      this.EFA = new Decimal2(4260);
      this.SAP = new Decimal2(36);
      this.KFB = this.ZKF.times(new Decimal2(9756)).toDP(0, Decimal2.ROUND_DOWN);
    } else if (this.STKL === 3) {
      this.KZTAB = 2;
      this.SAP = new Decimal2(36);
      this.KFB = this.ZKF.times(new Decimal2(9756)).toDP(0, Decimal2.ROUND_DOWN);
    } else if (this.STKL === 4) {
      this.SAP = new Decimal2(36);
      this.KFB = this.ZKF.times(new Decimal2(4878)).toDP(0, Decimal2.ROUND_DOWN);
    } else if (this.STKL === 5) {
      this.SAP = new Decimal2(36);
      this.KFB = new Decimal2(0);
    } else {
      this.KFB = new Decimal2(0);
    }
    this.ZTABFB = this.EFA.plus(this.ANP).plus(this.SAP).plus(this.FVBZ).toDP(2, Decimal2.ROUND_DOWN);
  }
  /**
   * Ermittlung Jahreslohnsteuer
   * PAP Seite 23
   */
  MLSTJAHR() {
    this.UPEVP();
    this.ZVE = this.ZRE4.minus(this.ZTABFB).minus(this.VSP);
    this.UPMLST();
  }
  /**
   * PAP Seite 24
   */
  UPLSTLZZ() {
    this.JW = this.LSTJAHR.times(this.ZAHL100);
    this.UPANTEIL();
    this.LSTLZZ = this.ANTEIL1;
  }
  /**
   * PAP Seite 25
   */
  UPMLST() {
    if (this.ZVE.cmp(this.ZAHL1) === -1) {
      this.ZVE = new Decimal2(0);
      this.X = new Decimal2(0);
    } else {
      this.X = this.ZVE.div(new Decimal2(this.KZTAB)).toDP(0, Decimal2.ROUND_DOWN);
    }
    if (this.STKL < 5) {
      this.UPTAB26();
    } else {
      this.MST5_6();
    }
  }
  /**
   * Vorsorgepauschale (§ 39b Absatz 2 Satz 5 Nummer 3 EStG)
   * PAP Seite 26
   */
  UPEVP() {
    if (this.KRV === 1) {
      this.VSPR = new Decimal2(0);
    } else {
      if (this.ZRE4VP.cmp(this.BBGRVALV) === 1) {
        this.ZRE4VPR = this.BBGRVALV;
      } else {
        this.ZRE4VPR = this.ZRE4VP;
      }
      this.VSPR = this.ZRE4VPR.times(this.RVSATZAN).toDP(2, Decimal2.ROUND_DOWN);
    }
    this.MVSPKVPV();
    if (this.ALV === 1) {
    } else {
      if (this.STKL === 6) {
      } else {
        this.MVSPHB();
      }
    }
  }
  /**
   * Vorsorgepauschale (§ 39b Absatz 2 Satz 5 Nummer 3 Buchstaben b bis d EStG)
   * PAP Seite 27
   */
  MVSPKVPV() {
    if (this.ZRE4VP.cmp(this.BBGKVPV) === 1) {
      this.ZRE4VPR = this.BBGKVPV;
    } else {
      this.ZRE4VPR = this.ZRE4VP;
    }
    if (this.PKV > 0) {
      if (this.STKL === 6) {
        this.VSPKVPV = new Decimal2(0);
      } else {
        this.PKPVAGZJ = this.PKPVAGZ.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
        this.VSPKVPV = this.PKPV.times(this.ZAHL12).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
        this.VSPKVPV = this.VSPKVPV.minus(this.PKPVAGZJ);
        if (this.VSPKVPV.cmp(new Decimal2(0)) === -1) {
          this.VSPKVPV = new Decimal2(0);
        }
      }
    } else {
      this.VSPKVPV = this.ZRE4VPR.times(this.KVSATZAN.plus(this.PVSATZAN)).toDP(2, Decimal2.ROUND_DOWN);
    }
    this.VSP = this.VSPKVPV.plus(this.VSPR).toDP(0, Decimal2.ROUND_UP);
  }
  /**
   * Höchstbetragsberechnung zur Arbeitslosenversicherung
   * (§ 39b Absatz 2 Satz 5 Nummer 3 Buchstabe e EStG)
   * PAP Seite 28
   */
  MVSPHB() {
    if (this.ZRE4VP.cmp(this.BBGRVALV) === 1) {
      this.ZRE4VPR = this.BBGRVALV;
    } else {
      this.ZRE4VPR = this.ZRE4VP;
    }
    this.VSPALV = this.AVSATZAN.times(this.ZRE4VPR).toDP(2, Decimal2.ROUND_DOWN);
    this.VSPHB = this.VSPALV.plus(this.VSPKVPV).toDP(2, Decimal2.ROUND_DOWN);
    if (this.VSPHB.cmp(new Decimal2(1900)) === 1) {
      this.VSPHB = new Decimal2(1900);
    }
    this.VSPN = this.VSPR.plus(this.VSPHB).toDP(0, Decimal2.ROUND_UP);
    if (this.VSPN.cmp(this.VSP) === 1) {
      this.VSP = this.VSPN;
    }
  }
  /**
   * Lohnsteuer fuer die Steuerklassen V und VI (§ 39b Absatz 2 Satz 7 EStG)
   * PAP Seite 29
   */
  MST5_6() {
    this.ZZX = this.X;
    if (this.ZZX.cmp(this.W2STKL5) === 1) {
      this.ZX = this.W2STKL5;
      this.UP5_6();
      if (this.ZZX.cmp(this.W3STKL5) === 1) {
        this.ST = this.ST.plus(this.W3STKL5.minus(this.W2STKL5).times(new Decimal2("0.42"))).toDP(0, Decimal2.ROUND_DOWN);
        this.ST = this.ST.plus(this.ZZX.minus(this.W3STKL5).times(new Decimal2("0.45"))).toDP(0, Decimal2.ROUND_DOWN);
      } else {
        this.ST = this.ST.plus(this.ZZX.minus(this.W2STKL5).times(new Decimal2("0.42"))).toDP(0, Decimal2.ROUND_DOWN);
      }
    } else {
      this.ZX = this.ZZX;
      this.UP5_6();
      if (this.ZZX.cmp(this.W1STKL5) === 1) {
        this.VERGL = this.ST;
        this.ZX = this.W1STKL5;
        this.UP5_6();
        this.HOCH = this.ST.plus(this.ZZX.minus(this.W1STKL5).times(new Decimal2("0.42"))).toDP(0, Decimal2.ROUND_DOWN);
        if (this.HOCH.cmp(this.VERGL) === -1) {
          this.ST = this.HOCH;
        } else {
          this.ST = this.VERGL;
        }
      }
    }
  }
  /**
   * Unterprogramm zur Lohnsteuer fuer die Steuerklassen V und VI
   * (§ 39b Absatz 2 Satz 7 EStG)
   * PAP Seite 30
   */
  UP5_6() {
    this.X = this.ZX.times(new Decimal2("1.25")).toDP(0, Decimal2.ROUND_DOWN);
    this.UPTAB26();
    this.ST1 = this.ST;
    this.X = this.ZX.times(new Decimal2("0.75")).toDP(0, Decimal2.ROUND_DOWN);
    this.UPTAB26();
    this.ST2 = this.ST;
    this.DIFF = this.ST1.minus(this.ST2).times(this.ZAHL2);
    this.MIST = this.ZX.times(new Decimal2("0.14")).toDP(0, Decimal2.ROUND_DOWN);
    if (this.MIST.cmp(this.DIFF) === 1) {
      this.ST = this.MIST;
    } else {
      this.ST = this.DIFF;
    }
  }
  /**
   * Solidaritätszuschlag
   * PAP Seite 31
   */
  MSOLZ() {
    this.SOLZFREI = this.SOLZFREI.times(new Decimal2(this.KZTAB));
    if (this.JBMG.cmp(this.SOLZFREI) === 1) {
      this.SOLZJ = this.JBMG.times(new Decimal2("5.5")).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.SOLZMIN = this.JBMG.minus(this.SOLZFREI).times(new Decimal2("11.9")).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      if (this.SOLZMIN.cmp(this.SOLZJ) === -1) {
        this.SOLZJ = this.SOLZMIN;
      }
      this.JW = this.SOLZJ.times(this.ZAHL100).toDP(0, Decimal2.ROUND_DOWN);
      this.UPANTEIL();
      this.SOLZLZZ = this.ANTEIL1;
    } else {
      this.SOLZLZZ = new Decimal2(0);
    }
    if (this.R > 0) {
      this.JW = this.JBMG.times(this.ZAHL100);
      this.UPANTEIL();
      this.BK = this.ANTEIL1;
    } else {
      this.BK = new Decimal2(0);
    }
  }
  /**
   * Anteil von Jahresbeträgen fuer einen LZZ (§ 39b Absatz 2 Satz 9 EStG)
   * PAP Seite 32
   */
  UPANTEIL() {
    if (this.LZZ === 1) {
      this.ANTEIL1 = this.JW;
    } else if (this.LZZ === 2) {
      this.ANTEIL1 = this.JW.div(this.ZAHL12).toDP(0, Decimal2.ROUND_DOWN);
    } else if (this.LZZ === 3) {
      this.ANTEIL1 = this.JW.times(this.ZAHL7).div(this.ZAHL360).toDP(0, Decimal2.ROUND_DOWN);
    } else {
      this.ANTEIL1 = this.JW.div(this.ZAHL360).toDP(0, Decimal2.ROUND_DOWN);
    }
  }
  /**
   * Berechnung sonstiger Bezüge nach § 39b Absatz 3 Sätze 1 bis 8 EStG
   * PAP Seite 33
   */
  MSONST() {
    this.LZZ = 1;
    if (this.ZMVB === 0) {
      this.ZMVB = 12;
    }
    if (this.SONSTB.cmp(new Decimal2(0)) === 0 && this.MBV.cmp(new Decimal2(0)) === 0) {
      this.LSTSO = new Decimal2(0);
      this.STS = new Decimal2(0);
      this.SOLZS = new Decimal2(0);
      this.BKS = new Decimal2(0);
    } else {
      this.MOSONST();
      this.ZRE4J = this.JRE4.plus(this.SONSTB).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.ZVBEZJ = this.JVBEZ.plus(this.VBS).div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      this.VBEZBSO = this.STERBE;
      this.MRE4SONST();
      this.MLSTJAHR();
      this.WVFRBM = this.ZVE.minus(this.GFB).times(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
      if (this.WVFRBM.cmp(new Decimal2(0)) === -1) {
        this.WVFRBM = new Decimal2(0);
      }
      this.LSTSO = this.ST.times(this.ZAHL100);
      this.STS = this.LSTSO.minus(this.LSTOSO).times(new Decimal2(this.f)).div(this.ZAHL100).toDP(0, Decimal2.ROUND_DOWN).times(this.ZAHL100);
      this.STSMIN();
    }
  }
  /**
   * PAP Seite 34
   */
  STSMIN() {
    if (this.STS.cmp(new Decimal2(0)) === -1) {
      if (this.MBV.cmp(new Decimal2(0)) === 0) {
      } else {
        this.LSTLZZ = this.LSTLZZ.plus(this.STS);
        if (this.LSTLZZ.cmp(new Decimal2(0)) === -1) {
          this.LSTLZZ = new Decimal2(0);
        }
        this.SOLZLZZ = this.SOLZLZZ.plus(this.STS.times(new Decimal2("5.5").div(this.ZAHL100))).toDP(0, Decimal2.ROUND_DOWN);
        if (this.SOLZLZZ.cmp(new Decimal2(0)) === -1) {
          this.SOLZLZZ = new Decimal2(0);
        }
        this.BK = this.BK.plus(this.STS);
        if (this.BK.cmp(new Decimal2(0)) === -1) {
          this.BK = new Decimal2(0);
        }
      }
      this.STS = new Decimal2(0);
      this.SOLZS = new Decimal2(0);
    } else {
      this.MSOLZSTS();
    }
    if (this.R > 0) {
      this.BKS = this.STS;
    } else {
      this.BKS = new Decimal2(0);
    }
  }
  /**
   * Berechnung des SolZ auf sonstige Bezüge
   * PAP Seite 35
   */
  MSOLZSTS() {
    if (this.ZKF.cmp(new Decimal2(0)) === 1) {
      this.SOLZSZVE = this.ZVE.minus(this.KFB);
    } else {
      this.SOLZSZVE = this.ZVE;
    }
    if (this.SOLZSZVE.cmp(new Decimal2(1)) === -1) {
      this.SOLZSZVE = new Decimal2(0);
      this.X = new Decimal2(0);
    } else {
      this.X = this.SOLZSZVE.div(new Decimal2(this.KZTAB)).toDP(0, Decimal2.ROUND_DOWN);
    }
    if (this.STKL < 5) {
      this.UPTAB26();
    } else {
      this.MST5_6();
    }
    this.SOLZSBMG = this.ST.times(new Decimal2(this.f)).toDP(0, Decimal2.ROUND_DOWN);
    if (this.SOLZSBMG.cmp(this.SOLZFREI) === 1) {
      this.SOLZS = this.STS.times(new Decimal2("5.5")).div(this.ZAHL100).toDP(0, Decimal2.ROUND_DOWN);
    } else {
      this.SOLZS = new Decimal2(0);
    }
  }
  /**
   * Sonderberechnung ohne sonstige Bezüge für Berechnung bei sonstigen Bezügen
   * PAP Seite 36
   */
  MOSONST() {
    this.ZRE4J = this.JRE4.div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    this.ZVBEZJ = this.JVBEZ.div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    this.JLFREIB = this.JFREIB.div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    this.JLHINZU = this.JHINZU.div(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    this.MRE4();
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.minus(this.JRE4ENT.div(this.ZAHL100));
    this.MZTABFB();
    this.VFRBS1 = this.ANP.plus(this.FVB.plus(this.FVBZ)).times(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRBO = this.ZVE.minus(this.GFB).times(this.ZAHL100).toDP(2, Decimal2.ROUND_DOWN);
    if (this.WVFRBO.cmp(new Decimal2(0)) === -1) {
      this.WVFRBO = new Decimal2(0);
    }
    this.LSTOSO = this.ST.times(this.ZAHL100);
  }
  /**
   * Sonderberechnung mit sonstigen Bezüge für Berechnung bei sonstigen Bezügen
   * PAP Seite 37
   */
  MRE4SONST() {
    this.MRE4();
    this.FVB = this.FVBSO;
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.plus(this.MBV.div(this.ZAHL100)).minus(this.JRE4ENT.div(this.ZAHL100)).minus(this.SONSTENT.div(this.ZAHL100));
    this.FVBZ = this.FVBZSO;
    this.MZTABFB();
    this.VFRBS2 = this.ANP.plus(this.FVB).plus(this.FVBZ).times(this.ZAHL100).minus(this.VFRBS1);
  }
  /**
   * Tarifliche Einkommensteuer §32a EStG
   * PAP Seite 38
   */
  UPTAB26() {
    if (this.X.cmp(this.GFB.plus(this.ZAHL1)) === -1) {
      this.ST = new Decimal2(0);
    } else if (this.X.cmp(new Decimal2(17800)) === -1) {
      this.Y = this.X.minus(this.GFB).div(this.ZAHL10000).toDP(6, Decimal2.ROUND_DOWN);
      this.RW = this.Y.times(new Decimal2("914.51"));
      this.RW = this.RW.plus(new Decimal2(1400));
      this.ST = this.RW.times(this.Y).toDP(0, Decimal2.ROUND_DOWN);
    } else if (this.X.cmp(new Decimal2(69879)) === -1) {
      this.Y = this.X.minus(new Decimal2(17799)).div(this.ZAHL10000).toDP(6, Decimal2.ROUND_DOWN);
      this.RW = this.Y.times(new Decimal2("173.1"));
      this.RW = this.RW.plus(new Decimal2(2397));
      this.RW = this.RW.times(this.Y);
      this.ST = this.RW.plus(new Decimal2("1034.87")).toDP(0, Decimal2.ROUND_DOWN);
    } else if (this.X.cmp(new Decimal2(277826)) === -1) {
      this.ST = this.X.times(new Decimal2("0.42")).minus(new Decimal2("11135.63")).toDP(0, Decimal2.ROUND_DOWN);
    } else {
      this.ST = this.X.times(new Decimal2("0.45")).minus(new Decimal2("19470.38")).toDP(0, Decimal2.ROUND_DOWN);
    }
    this.ST = this.ST.times(new Decimal2(this.KZTAB));
  }
};

// src/core/calculate.ts
var PAP_REGISTRY = {
  2025: Pap2025,
  2026: Pap2026
};
function calculate(year, inputs) {
  const PapClass = PAP_REGISTRY[year];
  if (!PapClass) {
    const supported = Object.keys(PAP_REGISTRY).join(", ");
    throw new Error(`Unsupported tax year: ${year}. Supported: ${supported}`);
  }
  const pap = new PapClass();
  pap.setInputs(inputs);
  pap.calculate();
  return pap.getOutputs();
}
var SUPPORTED_YEARS = Object.keys(PAP_REGISTRY).map(Number);

export {
  INPUT_DEFAULTS,
  STANDARD_OUTPUT_NAMES,
  DBA_OUTPUT_NAMES,
  ALL_OUTPUT_NAMES,
  calculate,
  SUPPORTED_YEARS
};
