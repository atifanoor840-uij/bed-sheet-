export type Category = "Bedsheets" | "Duvet Covers" | "Pillow Covers" | "Comforter Sets" | "Fitted Sheets";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  compareAt: number;
  /** First photo is the one shown on cards; the rest appear in the product gallery. */
  images: string[];
  colour: string;
  isNew?: boolean;
  /** For pillow covers: the bedsheet or duvet set they are made to match. */
  match?: string;
  stock: number;
  /** Hidden products stay in the admin but are not shown in the store. */
  active: boolean;
};

export const CATEGORY_NAMES: Category[] = ["Bedsheets", "Duvet Covers", "Pillow Covers", "Comforter Sets", "Fitted Sheets"];

// Photos: Unsplash (free licence). Replace with your own product shots.
export const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const photos = {
  heroA: u("1631048501851-4aa85ffc3be8"),
  heroB: u("1714138100706-790c1b19056a"),
  heroC: u("1606796913825-2b02883605e9"),
  story: u("1688384452844-8364c3e2fc28"),
  detail: u("1598535746036-87d13382f6a6"),
  room: u("1640109478916-f445f8f19b11"),
  // Sub pages
  about: u("1616594039964-ae9021a400a0"),
  cotton: u("1633527992904-53f86f81a23a"),
  folded: u("1640747669771-b82a6e40f534"),
  swatches: u("1624516268152-1e48624026ed"),
  suite: u("1616594092403-fb65629b0a46"),
  pillows: u("1559841771-599b6eeaca62"),
  contact: u("1616486029423-aaa4789e8c9a"),
  faq: u("1496417263034-38ec4f0b665a"),
  shipping: u("1587293852726-70cdb56c2866"),
  warehouse: u("1684695749267-233af13276d0"),
  exchanges: u("1699797467199-6bdf301649e8"),
  laundry: u("1582735689369-4fe89db7114c"),
  washer: u("1586284359445-2e1d8db7f4cd"),
  sizeGuide: u("1625334782252-da92af3ad887"),
  wholesale: u("1534639077088-d702bcf685e7"),
  login: u("1506720186575-11354d325017"),
  register: u("1722942717941-210f6a0acb45"),
  account: u("1600210491305-7396500b5b31"),
  thanks: u("1703783010857-9bd7a7b97c50"),
  weave: u("1614226114676-8e02ac5f4763"),
  texture: u("1542728929-2b5d9a0c8d48"),
  pillowStack: u("1672017088948-9a26a16dd39e"),
  pillowPair: u("1698746044395-85beb2b04522"),
  hotelA: u("1728488447178-30a5cf726425"),
  hotelB: u("1728488445491-31e1a683b1c1"),
  navyHeadboard: u("1717930290246-53c32a1184ca"),
  peachRoom: u("1745613999710-1aaf60145502"),
  greyRoom: u("1758974817671-24f627809115"),
  brickRoom: u("1781781490874-5c8c46637ceb"),
  woodRoom: u("1688384452579-a90e7a7f1aff"),
  quilted: u("1684841566323-24a0a9961f19"),
  satin: u("1612650760263-2d9ec04e0717"),
  crumpled: u("1596586371480-bf9119b62c74"),
};

export const PRICE = 2500;
export const COMPARE_AT = 5500;
export const PROMO = { code: "NEEND10", rate: 0.1 };

export const categories: { name: Category; image: string; banner: string[]; blurb: string }[] = [
  {
    name: "Bedsheets",
    image: u("1699436639670-1e5799b14aae"),
    banner: [u("1638878468165-a974415fed4f"), u("1561316441-2ab442340b55"), u("1728488445397-b51358d33396")],
    blurb: "Three-piece cotton sets: a flat sheet and two pillow covers.",
  },
  {
    name: "Duvet Covers",
    image: u("1603087970319-4c90bd58ddeb"),
    banner: [u("1504310996069-2357d42d5061"), u("1634208006171-6713e0c9a25e"), u("1684841566323-24a0a9961f19")],
    blurb: "Soft percale covers with button closures and corner ties.",
  },
  {
    name: "Pillow Covers",
    image: u("1698746044395-85beb2b04522"),
    banner: [u("1672017088948-9a26a16dd39e"), u("1724092130849-84521869a40c"), u("1764008660996-f138d51b5723")],
    blurb: "Made in the same fabrics as our sheets and duvets, so every set matches.",
  },
  {
    name: "Comforter Sets",
    image: u("1686827986080-8ee55b055a2f"),
    banner: [u("1631048501851-4aa85ffc3be8"), u("1774427697365-f3f50b6d5eca"), u("1564019472231-4586c552dc27")],
    blurb: "Seven-piece layered sets, filled and ready for winter.",
  },
  {
    name: "Fitted Sheets",
    image: u("1598535746036-87d13382f6a6"),
    banner: [u("1597308451192-d17c89701ef5"), u("1606855637183-ea2a00b6f15f"), u("1587614977104-693ef4e858e4")],
    blurb: "Deep elasticated pockets for mattresses up to 14 inches.",
  },
];

/** Real-home photos used in galleries on the home and about pages. */
export const lookbook = [
  u("1728488447178-30a5cf726425"),
  u("1745613999710-1aaf60145502"),
  u("1717930290246-53c32a1184ca"),
  u("1758974817671-24f627809115"),
  u("1781781490874-5c8c46637ceb"),
  u("1698956696531-b8c7e44653f2"),
  u("1688384452579-a90e7a7f1aff"),
  u("1617325247661-675ab4b64ae2"),
];

const bedSizes = ["Single", "Double", "King", "Super King"];
const pillowSizes = ["Standard 20×30", "King 20×36"];

export const sizesFor = (pr: Product) => (pr.category === "Pillow Covers" ? pillowSizes : bedSizes);
export const defaultSize = (pr: Product) => (pr.category === "Pillow Covers" ? pillowSizes[0] : "King");

export const formatPrice = (n: number) => "Rs. " + n.toLocaleString("en-PK");

export const discount = (pr: Product) => Math.round((1 - pr.price / pr.compareAt) * 100);

/** Pillow covers made for a set, or the set a pillow cover belongs to. */
export const getMatches = (pr: Product, all: Product[]) =>
  pr.match ? all.filter((x) => x.slug === pr.match) : all.filter((x) => x.match === pr.slug);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
