const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class Database {
  constructor() {
    this.data = {
      users: [],
      products: [],
      services: [],
      inquiries: [],
      company: null,
      pricingTable: [],
      pricingNote: '',
    };
    this.isLoaded = false;
  }

  async init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.inquiries) {
          this.data.inquiries = [];
        }
        if (!this.data.company) {
          this.data.company = this.getDefaultCompany();
          this.save();
        }
        if (!this.data.pricingTable || this.data.pricingTable.length === 0) {
          this.data.pricingTable = this.getDefaultPricingTable();
          this.save();
        }
        if (!this.data.pricingNote) {
          this.data.pricingNote = '⚠️ Rates are based on market value & wholesale volume. Payment milestones: 30% advance on confirmation, 40% during site progress, 30% on completion.';
          this.save();
        }
        this.isLoaded = true;
      } catch (err) {
        console.error('Failed to read db.json, creating fallback seed:', err);
        await this.seed();
      }
    } else {
      await this.seed();
    }
  }

  async seed() {
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const clientPasswordHash = await bcrypt.hash('client123', 10);

    const initialUsers = [
      {
        id: 'usr_admin_01',
        name: 'Rahul Roy Chowdhury',
        email: 'admin@axz.com',
        password: adminPasswordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_client_01',
        name: 'Tanmay Dutta Builders',
        email: 'tanmay@bengalbuilders.com',
        password: clientPasswordHash,
        role: 'client',
        createdAt: new Date().toISOString(),
      },
    ];

    const initialProducts = [
      {
        id: 'prod_bricks_01',
        name: 'Red Clay Construction Bricks',
        category: 'Masonry',
        price: '₹14,000',
        unit: 'Per 1000 Pieces',
        variety: '1 No. (₹14,000) • Solling (₹16,000)',
        badge: '1 NO. & SOLLING',
        images: ['/images/updated/bricks-red-clay.jpeg'],
        specs: ['Uniform shape & sharp edges', 'High compressive strength', 'Ideal for walls & solling'],
        description: 'First-class red clay bricks directly sourced from Kilns. Ideal for high-durability load-bearing walls and brick solling foundations.',
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_cement_02',
        name: 'Certified Cement (Ultratech & JSW)',
        category: 'Cement & Steel',
        price: '₹320 – ₹330',
        unit: 'Per 50kg Bag (+ GST)',
        variety: 'Ultratech: ₹330/- • JSW: ₹320/- • ACC F2R',
        badge: 'PPC / PSC GRADE',
        images: ['/images/updated/cement-ultratech-stack.jpeg'],
        specs: ['Fresh factory direct batches', 'Weather Pro & rapid hardening', 'Optimal concrete bonding'],
        description: 'Authorized depot stock of PPC & PSC cement bags for RCC slab casting, plastering, and structural masonry.',
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_steel_03',
        name: 'TMT Reinforcement Bars (Fe 550D)',
        category: 'Cement & Steel',
        price: 'As Per Listing',
        unit: 'Per M.Tonn / Market Rate',
        variety: 'Tata Tiscon • Shyam Steel • Captain 600',
        badge: 'FE 550D CERTIFIED',
        images: ['/images/updated/iron-saria-ribbed.jpeg'],
        specs: ['High seismic resistance', 'Superior elongation & ductility', 'Anti-corrosive ribs'],
        description: 'High-ductility earthquake-resistant TMT rebars available in standard diameters (8mm, 10mm, 12mm, 16mm, 20mm, 25mm).',
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_sand_04',
        name: 'Sand for Casting & Plastering',
        category: 'Sand & Aggregate',
        price: '₹9,700',
        unit: 'Per 4 M.Tonns (River / M-Sand)',
        variety: 'Silver Sand: ₹2,900 / 100 Sq.Ft • Coarse Sand',
        badge: 'QUALITY M-SAND',
        images: ['/images/updated/sand-fine-mound.jpeg'],
        specs: ['Double-screened silt-free', 'Optimal fineness modulus', 'Ready for slab casting'],
        description: 'Clean washed river sand and manufactured concrete sand (M-Sand) meeting IS:383 grading specifications.',
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_aggregate_05',
        name: 'Crushed Black Stone Chips (Aggregate)',
        category: 'Sand & Aggregate',
        price: '₹38 – ₹44',
        unit: 'Per Cubic Foot',
        variety: '5/8 inch • 3/4 inch (20mm) • 1/2 inch (12mm) • 10mm',
        badge: 'PAKVO EMBEDMENT',
        images: ['/images/updated/stone-chips-black-gravel.jpeg'],
        specs: ['Angular shape with high interlock', 'Zero mud contamination', 'Maximum concrete density'],
        description: 'Machine-crushed basalt black stone ballast for column foundations, beams, and high-strength lintels.',
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_paint_06',
        name: 'Dulux & Berger Architectural Paints',
        category: 'Finishes',
        price: 'Dealer Discounted Rate',
        unit: 'Per 20L Bucket / 1L Can',
        variety: 'WeatherShield Max • Walmasta • Bison Acrylic Emulsion',
        badge: 'DEALER AUTHORIZED',
        images: ['/images/updated/paints-dulux-berger-cans.jpeg'],
        specs: ['Weatherproof anti-fungal exterior', 'Smooth silk interior sheen', 'Original distributor seals'],
        description: 'Comprehensive exterior waterproofing emulsions, interior washable paints, primers, and wall putties.',
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const initialServices = [
      {
        id: 'serv_fleet_01',
        title: 'Depot Fleet Logistics & Rapid Tipper Dispatch',
        category: 'Logistics & Fleet',
        shortDesc: 'Guaranteed 24-hr site delivery across Howrah, Kolkata, and surrounding industrial hubs.',
        description: 'Our proprietary fleet of dedicated multi-axle tippers and medium carrier trucks guarantees prompt, undamaged transit from depot to site.',
        icon: 'truck',
        image: '/images/updated/sand-fine-mound.jpeg',
        features: [
          'Hydraulic self-unloading tippers',
          'GPS trackable delivery milestones',
          'Narrow lane access small carriers',
          'Direct site weighment slips provided',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'serv_quote_02',
        title: 'Bulk Contractor & Developer Pricing Structure',
        category: 'Commercial',
        shortDesc: 'Dedicated wholesale slabs for multi-story residential towers, commercial sheds, and infrastructure.',
        description: 'Direct procurement channel bypassing retail middlemen. We provide institutional volume rebates and consistent delivery schedules.',
        icon: 'building',
        image: '/images/updated/cement-ultratech-stack.jpeg',
        features: [
          'Direct ex-factory billing options',
          'Dedicated depot relationship officer',
          'Flexible staggered billing milestones',
          'Wholesale cement and TMT bundling',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'serv_qa_03',
        title: 'Material Lab Testing & Certified Sourcing',
        category: 'Quality Assurance',
        shortDesc: 'Verified compressive strength and Fe 550D rebar mill test reports before dispatch.',
        description: 'Quality is non-negotiable for lasting infrastructure. We provide certified laboratory test results and factory authenticity certificates on every batch.',
        icon: 'check-circle',
        image: '/images/updated/iron-saria-ribbed.jpeg',
        features: [
          'Fe 550D bend & rebend test reports',
          'Factory fresh 3-month cement seal check',
          'Silt-percentage verification for river sand',
          'Batch tracking from manufacturer dispatch',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'serv_contract_04',
        title: 'Long-Term Contractor Supply Contracts',
        category: 'Commercial',
        shortDesc: 'Price-lock agreements and continuous phased supply for residential and commercial complexes.',
        description: 'Protect your building budget against steel and cement volatility with milestone-bound commercial supply agreements managed by dedicated account managers.',
        icon: 'briefcase',
        image: '/images/updated/bricks-red-clay.jpeg',
        features: [
          'Secured stock reservation in local depots',
          'Priority queuing for emergency slab casting days',
          'Flexible credit and milestone payment cycles',
          'Single point-of-contact logistics manager',
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.data = {
      users: initialUsers,
      products: initialProducts,
      services: initialServices,
      inquiries: [],
      company: this.getDefaultCompany(),
      pricingTable: this.getDefaultPricingTable(),
      pricingNote: '⚠️ Rates are based on market value & wholesale volume. Payment milestones: 30% advance on confirmation, 40% during site progress, 30% on completion.',
    };

    this.save();
    this.isLoaded = true;
    console.log('Database seeded with initial administrative and business data.');
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save db.json:', err);
    }
  }

  // Collection CRUD
  findAll(collection, filterFn = null) {
    const list = this.data[collection] || [];
    if (!filterFn) return [...list];
    return list.filter(filterFn);
  }

  findOne(collection, filterFn) {
    const list = this.data[collection] || [];
    return list.find(filterFn) || null;
  }

  findById(collection, id) {
    const list = this.data[collection] || [];
    return list.find((item) => item.id === id) || null;
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const id = item.id || `${collection.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newItem = {
      ...item,
      id,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data[collection].push(newItem);
    this.save();
    return newItem;
  }

  update(collection, id, updates) {
    const list = this.data[collection] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    this.save();
    return updated;
  }

  delete(collection, id) {
    const list = this.data[collection] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;

    const [removed] = list.splice(index, 1);
    this.save();
    return removed;
  }

  getDefaultCompany() {
    return {
      facilityName: 'Sankrailjala Materials Depot, Howrah, West Bengal',
      operatingSchedule: 'Mon – Sat: 8:00 AM – 7:00 PM (Sunday: On-site prior booking dispatch)',
      hotline: '+91 9073453034',
      hotlineSubtitle: 'Instant Quotes & Site Dispatch',
      coverageRegion: 'Howrah, Kolkata, Sarenga, Beltala & Greater Bengal Sites',
      materialsGuarantee: '100% Genuine Ultratech, Tata Tiscon, Red Clay Bricks & M-Sand',
      email: 'royenterprise.contact@gmail.com',
      director: 'Rahul Roy Chowdhury',
      brandName: 'Entrepreneur AxZ',
      parentCompany: 'Roychowdhury and Sons',
      updatedAt: new Date().toISOString(),
    };
  }

  getCompany() {
    if (!this.data.company) {
      this.data.company = this.getDefaultCompany();
      this.save();
    }
    return { ...this.data.company };
  }

  updateCompany(updates) {
    const current = this.getCompany();
    this.data.company = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return { ...this.data.company };
  }

  getDefaultPricingTable() {
    return [
      {
        id: 'price_row_01',
        description: 'River / M-Sand',
        tag: '⭐ Quality',
        standardUnit: '4 M.Tonns',
        brandVariety: 'RCC Casting Quality Sand',
        benchmarkRate: '₹9,700/-',
        order: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'price_row_02',
        description: 'Silver Sand',
        tag: '',
        standardUnit: '100 Sq.Ft',
        brandVariety: 'Plastering & Fine Finish Sand',
        benchmarkRate: '₹2,900/-',
        order: 2,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'price_row_03',
        description: '5/8" Stone Aggregate',
        tag: '',
        standardUnit: '4 M.Tonns',
        brandVariety: '16mm Angular Ballast',
        benchmarkRate: '₹7,600/-',
        order: 3,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'price_row_04',
        description: 'Cement (PPC / PSC)',
        tag: '',
        standardUnit: '1 Bag (50kg)',
        brandVariety: 'Ultratech (₹330/- + GST) | JSW (₹320/-)',
        benchmarkRate: '₹320 – ₹330/-',
        order: 4,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'price_row_05',
        description: 'Waterproofing Chemical (No Damping)',
        tag: '',
        standardUnit: '20 Litres',
        brandVariety: 'Red Grade (₹2,600/-) | Gold Grade (₹6,400/-)',
        benchmarkRate: '₹2,600 – ₹6,400/-',
        order: 5,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'price_row_06',
        description: 'Bricks',
        tag: '',
        standardUnit: '1000 Pieces',
        brandVariety: '1 No. (₹14,000/-) | Solling (₹16,000/-)',
        benchmarkRate: '₹14,000 – ₹16,000/-',
        order: 6,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'price_row_07',
        description: 'TMT Steel Bar',
        tag: '',
        standardUnit: 'M.Tonns',
        brandVariety: 'Tata Tiscon / Shyam Steel / Skysail (Fe 550D)',
        benchmarkRate: 'As Per Listing',
        order: 7,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'price_row_08',
        description: 'Paints & Emulsions',
        tag: '',
        standardUnit: 'Per Litre / Bucket',
        brandVariety: 'By Choice: Dulux / Berger / Asian Paints',
        benchmarkRate: 'Catalog Choice',
        order: 8,
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  getPricingTable() {
    if (!this.data.pricingTable || this.data.pricingTable.length === 0) {
      this.data.pricingTable = this.getDefaultPricingTable();
      this.save();
    }
    const sorted = [...this.data.pricingTable].sort((a, b) => (a.order || 0) - (b.order || 0));
    return {
      items: sorted,
      footerNote: this.data.pricingNote || '⚠️ Rates are based on market value & wholesale volume. Payment milestones: 30% advance on confirmation, 40% during site progress, 30% on completion.',
    };
  }

  updatePricingNote(note) {
    this.data.pricingNote = note;
    this.save();
    return this.data.pricingNote;
  }
}

const db = new Database();
module.exports = db;
