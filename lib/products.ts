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
};

// Photos: Unsplash (free licence). Replace with your own product shots.
const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

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

const p = (slug: string, name: string, category: Category, colour: string, ids: string[], extra: Partial<Product> = {}): Product => ({
  slug,
  name,
  category,
  colour,
  price: PRICE,
  compareAt: COMPARE_AT,
  images: ids.map(u),
  ...extra,
});

export const products: Product[] = [
  // Bedsheets
  p("sandstone-stripe", "Sandstone Stripe", "Bedsheets", "Brown", ["1699436639670-1e5799b14aae", "1608118939885-ac618d5d101a", "1730719500613-abd184fc0932", "1617325247661-675ab4b64ae2"], { isNew: true }),
  p("terracotta", "Terracotta", "Bedsheets", "Rust", ["1561316441-2ab442340b55", "1693080191275-08a657025791", "1745613999710-1aaf60145502", "1691256676366-370303d55b61"], { isNew: true }),
  p("sage-room", "Sage", "Bedsheets", "White", ["1714138100706-790c1b19056a", "1640109478916-f445f8f19b11", "1691207699465-603a8be4f7e3", "1758974817671-24f627809115"]),
  p("oak-cotton", "Oak Cotton", "Bedsheets", "Sky", ["1688384452844-8364c3e2fc28", "1614617021766-d00d5d28b1ab", "1688384452551-5cacc39946e0", "1620751852890-a89137ec78b9"]),
  p("morning-light", "Morning Light", "Bedsheets", "Taupe", ["1536349788264-1b816db3cc13", "1780672823863-1f40d9c6435d", "1429117237875-aa29229d99f0", "1521218784442-4c7dd69eab2a"], { isNew: true }),
  p("coastal-stripe", "Coastal Stripe", "Bedsheets", "Blue", ["1638878468165-a974415fed4f", "1724092130849-84521869a40c", "1656433795335-b62feb58e2fb", "1633865082308-b858e086c1f6"], { isNew: true }),
  p("charcoal", "Charcoal", "Bedsheets", "Grey", ["1637589467948-1988d8a66009", "1629455281771-21b9a5176722", "1637589468511-d3313f6ba76d", "1559051668-9024c9b5e84b"]),
  p("pearl", "Pearl", "Bedsheets", "Cream", ["1612650760263-2d9ec04e0717", "1615742708220-e35f32936bd1", "1539438050859-39219d86bde8", "1602260513914-a28f4fbdfd20"]),
  p("hotel-suite", "Hotel Suite", "Bedsheets", "White", ["1728488445397-b51358d33396", "1728488444816-47abc89d82a4", "1672017088948-9a26a16dd39e", "1444341658138-5fbf6377e0cf"]),

  // Duvet covers
  p("midnight-grid", "Midnight Grid", "Duvet Covers", "Navy", ["1603087970319-4c90bd58ddeb", "1586318018858-4df3297d11d5", "1717930290246-53c32a1184ca", "1698746043955-42b03ddedfcb"], { isNew: true }),
  p("blush", "Blush", "Duvet Covers", "Pink", ["1634208006171-6713e0c9a25e", "1639813806535-b206d3dcf3b6", "1629949008790-ca50382f7f98", "1770036093292-81a073b107ca"], { isNew: true }),
  p("linen-grey", "Linen Grey", "Duvet Covers", "Grey", ["1605459437907-541c4e2c0ed1", "1617233209513-7f6803109623", "1600414428640-f78a67c2aa3b", "1629449594319-b7197c481a63"]),
  p("heritage", "Heritage", "Duvet Covers", "Stone", ["1629230324981-0293a8ae17e9", "1698956696531-b8c7e44653f2", "1728488444816-47abc89d82a4", "1698746043925-f18248eaf26c"]),
  p("blue-floral", "Blue Floral", "Duvet Covers", "Blue", ["1504310996069-2357d42d5061", "1764008660996-f138d51b5723", "1596586371480-bf9119b62c74", "1698746165735-19c84af48276"], { isNew: true }),
  p("mist", "Mist", "Duvet Covers", "Blue", ["1610508072973-dd4e656a677f", "1688384452579-a90e7a7f1aff", "1570786240066-c0d753711cfe", "1507427235685-0bc9cf31856a"]),
  p("rose-dawn", "Rose Dawn", "Duvet Covers", "Pink", ["1642357083553-0afd747c38cd", "1698746044340-ae5559412fd5", "1629949008790-ca50382f7f98", "1738344480198-4c0fa46a224b"]),
  p("dove-quilt", "Dove Quilted", "Duvet Covers", "Grey", ["1684841566323-24a0a9961f19", "1762199904500-266a6bd4e243", "1600414428640-f78a67c2aa3b", "1630809355701-af054d63cb31"]),

  // Pillow covers — each made to match a bedsheet or duvet set
  p("pillow-sandstone", "Sandstone Pillow Covers", "Pillow Covers", "Brown", ["1730719500613-abd184fc0932", "1699436639670-1e5799b14aae", "1672017088948-9a26a16dd39e"], { match: "sandstone-stripe", isNew: true }),
  p("pillow-terracotta", "Terracotta Pillow Covers", "Pillow Covers", "Rust", ["1691256676366-370303d55b61", "1561316441-2ab442340b55", "1698746043836-9ccb3b1413ef"], { match: "terracotta" }),
  p("pillow-sage", "Sage Pillow Covers", "Pillow Covers", "White", ["1691207699465-603a8be4f7e3", "1714138100706-790c1b19056a", "1698746158409-31df3573756f"], { match: "sage-room" }),
  p("pillow-coastal", "Coastal Stripe Pillow Covers", "Pillow Covers", "Blue", ["1724092130849-84521869a40c", "1638878468165-a974415fed4f", "1570786240066-c0d753711cfe"], { match: "coastal-stripe", isNew: true }),
  p("pillow-charcoal", "Charcoal Pillow Covers", "Pillow Covers", "Grey", ["1559051668-9024c9b5e84b", "1637589467948-1988d8a66009", "1629449594319-b7197c481a63"], { match: "charcoal" }),
  p("pillow-pearl", "Pearl Pillow Covers", "Pillow Covers", "Cream", ["1539438050859-39219d86bde8", "1612650760263-2d9ec04e0717", "1652161853855-005106816b9f"], { match: "pearl" }),
  p("pillow-midnight", "Midnight Pillow Covers", "Pillow Covers", "Navy", ["1717930290246-53c32a1184ca", "1603087970319-4c90bd58ddeb", "1698746043955-42b03ddedfcb"], { match: "midnight-grid" }),
  p("pillow-blush", "Blush Pillow Covers", "Pillow Covers", "Pink", ["1629949008790-ca50382f7f98", "1634208006171-6713e0c9a25e", "1698746044340-ae5559412fd5"], { match: "blush", isNew: true }),
  p("pillow-linen-grey", "Linen Grey Pillow Covers", "Pillow Covers", "Grey", ["1600414428640-f78a67c2aa3b", "1605459437907-541c4e2c0ed1", "1629449594319-b7197c481a63"], { match: "linen-grey" }),
  p("pillow-floral", "Blue Floral Pillow Covers", "Pillow Covers", "Blue", ["1764008660996-f138d51b5723", "1504310996069-2357d42d5061", "1737094661981-baad6b211852"], { match: "blue-floral", isNew: true }),
  p("pillow-mist", "Mist Pillow Covers", "Pillow Covers", "Blue", ["1570786240066-c0d753711cfe", "1610508072973-dd4e656a677f", "1698746044395-85beb2b04522"], { match: "mist" }),
  p("pillow-sunlit", "Sunlit Pillow Covers", "Pillow Covers", "White", ["1584100936595-c0654b55a2e2", "1629949008265-af1bcaf59786", "1698746158409-31df3573756f"], { match: "coral" }),

  // Comforter sets
  p("nordic-white", "Nordic White", "Comforter Sets", "White", ["1564019472231-4586c552dc27", "1542728929-2b5d9a0c8d48", "1601276174812-63280a55656e", "1698746044395-85beb2b04522"]),
  p("harbour-blue", "Harbour Blue", "Comforter Sets", "Blue", ["1686827986080-8ee55b055a2f", "1689578258216-d718ce55169e", "1507427235685-0bc9cf31856a", "1570786240066-c0d753711cfe"]),
  p("hotel-white", "Hotel White", "Comforter Sets", "White", ["1631048501851-4aa85ffc3be8", "1606796913825-2b02883605e9", "1728488447178-30a5cf726425", "1728488445491-31e1a683b1c1"]),
  p("coral", "Coral", "Comforter Sets", "Orange", ["1774427697365-f3f50b6d5eca", "1616486232086-81d47190669a", "1635594202056-9ea3b497e5c0", "1584100936595-c0654b55a2e2"], { isNew: true }),

  // Fitted sheets
  p("cloud-sateen", "Cloud Sateen", "Fitted Sheets", "White", ["1598535746036-87d13382f6a6", "1617233210035-36c869b56d3b", "1587614977104-693ef4e858e4", "1444341658138-5fbf6377e0cf"]),
  p("monochrome", "Monochrome", "Fitted Sheets", "Grey", ["1597308451192-d17c89701ef5", "1617233209992-61ab62dcb617", "1637589468511-d3313f6ba76d", "1629455281771-21b9a5176722"]),
  p("ivory-classic", "Ivory Classic", "Fitted Sheets", "Ivory", ["1606855637183-ea2a00b6f15f", "1612152605347-f93296cb657d", "1738344480198-4c0fa46a224b", "1587614977104-693ef4e858e4"]),
];

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

export const getProduct = (slug: string) => products.find((x) => x.slug === slug);

/** Pillow covers made for a set, or the set a pillow cover belongs to. */
export const getMatches = (pr: Product) =>
  pr.match ? products.filter((x) => x.slug === pr.match) : products.filter((x) => x.match === pr.slug);
