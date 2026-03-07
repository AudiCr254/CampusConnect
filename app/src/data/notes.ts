import type { Topic, Note, Feature, Stat, NavLink } from '@/types';

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Notes', href: '/notes' },
  { label: 'Ask AI', href: '#ask-ai' },
];

export const topics: Topic[] = [
  {
    id: 'intro',
    title: 'Introduction to Accounting',
    description: 'Learn the fundamentals of accounting, its nature, purpose, and the accounting equation.',
    lessons: 12,
    icon: 'BookOpen',
    color: 'bg-blue-500',
  },
  {
    id: 'recording',
    title: 'Recording Transactions',
    description: 'Master source documents, journals, and the recording process.',
    lessons: 8,
    icon: 'FileText',
    color: 'bg-green-500',
  },
  {
    id: 'statements',
    title: 'Financial Statements',
    description: 'Understand income statements, balance sheets, and cash flow statements.',
    lessons: 10,
    icon: 'BarChart3',
    color: 'bg-purple-500',
  },
  {
    id: 'assets',
    title: 'Assets & Liabilities',
    description: 'Learn about depreciation, property, plant, equipment, and liability management.',
    lessons: 6,
    icon: 'Building2',
    color: 'bg-orange-500',
  },
  {
    id: 'partnership',
    title: 'Partnership Accounts',
    description: 'Study partnership agreements, profit sharing, and partnership financial statements.',
    lessons: 8,
    icon: 'Users',
    color: 'bg-pink-500',
  },
  {
    id: 'company',
    title: 'Company Accounts',
    description: 'Explore share capital, company financial statements, and corporate accounting.',
    lessons: 10,
    icon: 'Building',
    color: 'bg-indigo-500',
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Accounts',
    description: 'Learn cost classification, manufacturing accounts, and production costing.',
    lessons: 7,
    icon: 'Factory',
    color: 'bg-teal-500',
  },
  {
    id: 'nonprofit',
    title: 'Non-Profit Organizations',
    description: 'Understand receipts and payments accounts, income and expenditure accounts.',
    lessons: 5,
    icon: 'Heart',
    color: 'bg-red-500',
  },
  {
    id: 'errors',
    title: 'Correction of Errors',
    description: 'Master suspense accounts and different types of accounting errors.',
    lessons: 6,
    icon: 'AlertCircle',
    color: 'bg-yellow-500',
  },
];

export const notes: Note[] = [
  // Introduction to Accounting
  {
    id: 'intro-1',
    topicId: 'intro',
    title: 'Nature and Purpose of Accounting',
    content: `Accounting is considered the language of business. It has evolved throughout the years as information needs changed and became more complex.

**Accounting as a Science:**
Accounting is the process of identifying, measuring, and communicating economic information to permit informed judgment and decisions by users of information.

**Accounting as an Art:**
Accounting is the art of recording (journalizing), classifying (posting to the ledger), summarizing in a significant manner and in terms of money, transactions and events which are, in part, at least of a financial character, and interpreting the results thereof to interested users.

**Accounting as an Information System:**
Accounting is a service activity, which functions to provide quantitative information, primarily financial in nature, about economic entities that is intended to be useful in making economic decisions.

**Key Processes:**
- **Identifying** - Recognition or non-recognition of business activities as accountable events
- **Measuring** - Assigning monetary amounts to accountable events
- **Communicating** - Presenting financial statements to decision makers
- **Recording** - Journalizing all accountable events
- **Classifying** - Posting to the ledger
- **Summarizing** - Preparing the five basic financial statements`,
  },
  {
    id: 'intro-2',
    topicId: 'intro',
    title: 'Objectives of Accounting',
    content: `**1. Systematic Recording of Transactions**
Basic objective of accounting is to systematically record the financial aspects of business transactions (book-keeping). These recorded transactions are later classified and summarized for preparation of financial statements.

**2. Ascertainment of Results**
Accountants prepare profit and loss account to know the results of business operations for a particular period. If revenue exceeds expenses, the business is profitable; if expenses exceed revenue, the business is running at a loss.

**3. Ascertainment of Financial Position**
The balance sheet (statement of financial position) shows what the business owes (liabilities) and what it owns (assets) on a certain date, helping ascertain the financial health of the business.

**4. Providing Information for Decision-Making**
Accounting aims to meet the information needs of decision-makers and helps them in rational decision-making through financial reports.

**5. Solvency Position**
The balance sheet gives information regarding the concern's ability to meet its liabilities in the short run (liquidity) and long run (solvency).`,
  },
  {
    id: 'intro-3',
    topicId: 'intro',
    title: 'Users of Accounting Information (GESCLIP)',
    content: `Users of accounting information can be divided into 7 major groups using the acronym **GESCLIP**:

**G - Government**
Needs accounting information to assess taxes (income tax, estate tax), determine business permit fees, and deal with economic problems like inflation.

**E - Employees**
Need accounting information to know if the business can provide necessary benefits and to understand the operations of the firm they work for.

**S - Suppliers (Trade Creditors)**
Providers of merchandise on account who need to determine if customers can pay accounts on time before extending credit.

**C - Customers/Clients/Consumers**
Need accounting information to determine business continuity, especially for long-term engagements, and to check if prices charged are reasonable.

**L - Lenders**
Banks and lending institutions need accounting information to determine a client's ability to pay obligations and interest when loans become due.

**I - Investors and Businessmen**
Need accounting information to make decisions about purchasing, selling, or holding stocks, and to determine which operations to continue or discontinue.

**P - Public**
All members of the public need accounting information to understand the economy, monitor businesses, and manage personal finances.`,
  },
  {
    id: 'intro-4',
    topicId: 'intro',
    title: 'The Accounting Equation',
    content: `The accounting equation forms the foundation for all accounting systems:

**Assets = Liabilities + Owner's Equity (Capital)**

This equation illustrates two facts about a company:
- What it owns (Assets)
- What it owes (Liabilities and Equity)

**Assets** are resources owned or controlled by the company for future benefits:
- Cash
- Accounts Receivable
- Prepaid Expenses
- Vehicles
- Buildings
- Goodwill
- Copyrights
- Patents

**Liabilities** are amounts owed to others:
- Accounts Payable
- Bank Loans
- Lines of Credit
- Personal Loans

**Owner's Equity** represents the owner's claim on assets after liabilities are paid.

The equation holds true for all business activities. If assets increase, either liabilities or owner's equity must increase to balance the equation.`,
  },
  
  // Recording Transactions
  {
    id: 'recording-1',
    topicId: 'recording',
    title: 'Source Documents',
    content: `Source documents provide input into the accounting system and describe financial transaction details:

**1. Quotations**
Used to let potential customers know the cost of goods or services before purchase. Commits the seller to a certain price.

**2. Purchase Orders (PO)**
A commercial document issued by a buyer to a seller, indicating types, quantities, and agreed prices. Forms a contract when accepted.

**3. Statement of Account**
A record of transactions on a customer's account during a specified period, showing purchases, payments, and balance due.

**4. Remittance Advice**
A letter sent by a customer to inform the supplier that their invoice has been paid, often accompanying the cheque.

**5. Receipts**
Issued to customers when they make payments in cash or cheques, showing firm details, date, amount, and receipt number.

**6. Petty Cash Vouchers**
Used to document disbursements from petty cash funds for small expenditures.

**7. Sales Invoice**
Communicates to clients about sums due for goods sold, including items purchased, quantities, discounts, and total amount owed.

**8. Purchase Invoice**
Raised by the creditor when the firm makes a credit purchase.

**9. Credit Notes**
Issued when debtors return goods, reducing the amount due.

**10. Debit Notes**
Raised by creditors when the firm returns goods.`,
  },
  {
    id: 'recording-2',
    topicId: 'recording',
    title: 'Books of Original Entry',
    content: `**Purchases Daybook**
Records all credit purchases of goods. Example format:

| Date | Details | Amount |
|------|---------|--------|
| May 1 | Malewa | 120,000 |
| May 4 | D. Songa | 98,000 |

**Sales Daybook**
Records all credit sales of goods. Example format:

| Date | Details | Amount |
|------|---------|--------|
| May 10 | Mbaraka | 97,000 |
| May 10 | Ndigiri | 120,000 |

**Returns Daybooks**
- Purchases Returns Daybook (Returns Outwards): Records goods returned to suppliers
- Sales Returns Daybook (Returns Inwards): Records goods returned by customers

**General Journal**
Used for recording transactions that don't fit in other daybooks, including:
- Opening entries
- Adjustments
- Correction of errors
- Transfer entries`,
  },

  // Financial Statements
  {
    id: 'statements-1',
    topicId: 'statements',
    title: 'Income Statement (Trading Account)',
    content: `The Income Statement determines net profit or loss in two stages:

**Stage 1: Gross Profit**
Gross Profit = Sales - Cost of Goods Sold

**Items Debited:**
- Opening Stock
- Purchases (less Returns Outwards)
- Direct Expenses (Carriage Inwards, Wages)

**Items Credited:**
- Sales (less Returns Inwards)
- Closing Stock

**Stage 2: Net Profit**
Net Profit = Gross Profit - Expenses + Other Income

**Format (Vertical):**
| | Sh |
|---|-----|
| Sales | XX |
| Less: Returns Inwards | (XX) |
| **Net Sales** | **XX** |
| Less: Cost of Sales | |
| Opening Stock | XX |
| Purchases | XX |
| Less: Returns Outwards | (XX) |
| Add: Carriage Inwards | XX |
| Cost of goods available | XX |
| Less: Closing Stock | (XX) |
| **Cost of Sales** | **(XX)** |
| **Gross Profit** | **XX** |`,
  },
  {
    id: 'statements-2',
    topicId: 'statements',
    title: 'Statement of Financial Position (Balance Sheet)',
    content: `The Balance Sheet shows the financial position at a specific point in time.

**Assets (Non-Current):**
- Property, Plant & Equipment
- Land and Buildings
- Machinery
- Motor Vehicles
- Furniture & Fittings

**Assets (Current):**
- Inventory/Stock
- Accounts Receivable (Debtors)
- Cash and Bank
- Prepayments

**Equity and Liabilities:**
- Capital/Owner's Equity
- Reserves
- Long-term Liabilities (Loans)
- Current Liabilities (Creditors, Bank Overdraft)

**Format:**
| Non-Current Assets | Cost | Dep. | NBV |
|-------------------|------|------|-----|
| Equipment | XX | (XX) | XX |
| **Total NCA** | | | **XX** |

| Current Assets | |
|---------------|-----|
| Inventory | XX |
| Debtors | XX |
| Cash | XX |
| **Total CA** | **XX** |

| **TOTAL ASSETS** | **XX** |`,
  },

  // Assets & Liabilities
  {
    id: 'assets-1',
    topicId: 'assets',
    title: 'Property, Plant and Equipment (IAS 16)',
    content: `**Definition:**
Tangible items that:
1. Are held for use in production, supply of goods/services, or administrative purposes
2. Are expected to be used during more than one period

**Recognition Criteria:**
- Probable that future economic benefits will flow to the entity
- Cost can be measured reliably

**Cost Components:**
1. Purchase price (including import duties, less trade discounts)
2. Costs directly attributable to bringing asset to working condition
3. Initial estimate of dismantling and restoration costs

**Measurement Models:**

**Cost Model:**
Asset carried at cost less accumulated depreciation and impairment losses.

**Revaluation Model:**
Asset carried at fair value at revaluation date less subsequent depreciation and impairment.

**Depreciation:**
Systematic allocation of depreciable amount over useful life.
- Depreciable Amount = Cost - Residual Value
- Methods: Straight-line, Reducing Balance, Sum of Digits`,
  },
  {
    id: 'assets-2',
    topicId: 'assets',
    title: 'Methods of Depreciation',
    content: `**1. Straight Line Method**
Fixed percentage of original cost written off each year.

Formula: (Cost - Residual Value) / Useful Life

Example: Asset costs Shs.20,000, 10% depreciation = Shs.2,000 per year.

**2. Reducing Balance Method**
Fixed percentage applied to the reducing book value.

Example: 20% on reducing balance:
- Year 1: 20% of 100,000 = 20,000
- Year 2: 20% of 80,000 = 16,000

**3. Sum of the Digits Method**
Fraction based on remaining life / sum of years' digits.

For 5-year life: Sum = 1+2+3+4+5 = 15
- Year 1: 5/15 of cost
- Year 2: 4/15 of cost
- etc.

**Objectives of Depreciation:**
1. Ascertain true value of assets
2. Make provision for replacement
3. Calculate correct profit/loss
4. Compute cost of production
5. Comply with legal provisions
6. Avail tax benefits`,
  },

  // Partnership
  {
    id: 'partnership-1',
    topicId: 'partnership',
    title: 'Partnership Definition and Types',
    content: `**Definition (Kenya Partnership Act 1962):**
The relationship which exists between persons carrying on a business in common with a view of profit.

**Essential Elements:**
1. Business (trade, occupation, or profession)
2. Carried on for profit
3. Carried on by all or any partner acting for all
4. Association of two or more persons
5. Common property alone does not create partnership

**Types of Partnerships:**

**General Partnership:**
- All partners have unlimited liability
- All partners can participate in management
- Governed by Partnership Act 1962

**Limited Partnership:**
- One or more general partners (unlimited liability)
- One or more limited partners (liability limited to capital contributed)
- Limited partners cannot participate in management
- Governed by Limited Partnership Act 1962

**Partnership Agreement (Deed) should cover:**
- Names of firm and business location
- Nature of business
- Capital contributions
- Profit sharing ratio
- Interest on capital and drawings
- Partner salaries
- Admission/retirement methods`,
  },
  {
    id: 'partnership-2',
    topicId: 'partnership',
    title: 'Partnership Appropriation Account',
    content: `The Appropriation Account shows how net profit is distributed among partners.

**Format:**
| | Shs | Shs |
|---|-----|-----|
| Net Profit | | XX |
| **Less:** | | |
| Interest on Capital: | | |
| - Partner A | XX | |
| - Partner B | XX | (XX) |
| Salaries: | | |
| - Partner A | XX | (XX) |
| **Balance of Profits** | | **XX** |
| **Shared:** | | |
| - Partner A (X/X) | XX | |
| - Partner B (X/X) | XX | (XX) |

**Example:**
Aisha, Birdi and Wafula share profits 3:2:1
Net profit: Shs.15,800,000
Interest on capital: 10% p.a.
Birdi's salary: Shs.4,500,000
Capitals: Aisha 8M, Birdi 6M, Wafula 6M

**Solution:**
- Interest: Aisha 800,000, Birdi 600,000, Wafula 600,000
- Salary: Birdi 4,500,000
- Balance: 15,800,000 - 6,500,000 = 9,300,000
- Shared: Aisha 4,650,000, Birdi 3,100,000, Wafula 1,550,000`,
  },

  // Company Accounts
  {
    id: 'company-1',
    topicId: 'company',
    title: 'Types of Companies',
    content: `**Private Companies:**
- Have "Limited" at the end of name
- Cannot invite public to invest
- Maximum 50 shareholders
- Restricted share transfer

**Public Companies:**
- Have "Public Limited Company" at end of name
- Can invite public to invest
- May be quoted on stock exchange
- Minimum 7 shareholders, no maximum

**Capital Structure:**

**Equity Capital:**
- Contributed Capital (money originally invested)
- Retained Earnings (profits kept in business)

**Debt Capital:**
- Bank loans
- Bonds
- Must be repaid with interest

**Types of Share Capital:**

**Ordinary Shares:**
- Voting rights
- Variable dividends
- Last to be paid in liquidation
- Higher risk, potentially higher return

**Preference Shares:**
- No voting rights (usually)
- Fixed dividend
- Paid before ordinary shareholders
- Lower risk, lower return`,
  },
  {
    id: 'company-2',
    topicId: 'company',
    title: 'Issue of Shares',
    content: `**Issue at Par:**
Shares issued at price equal to nominal value.

**Issue at Premium:**
Shares issued at price higher than nominal value.
Premium = Issue Price - Nominal Value

**Issue at Discount:**
Shares issued below nominal value (illegal in Kenya).

**Accounting Entries - Issue at Par:**
1. On application:
   DR Bank
   CR Share Application

2. On allotment:
   DR Share Application
   CR Share Capital

**Accounting Entries - Issue at Premium:**
1. On application:
   DR Bank
   CR Share Application

2. On allotment:
   DR Share Application
   CR Share Capital
   CR Share Premium

**Over and Under Subscription:**
- **Oversubscribed:** More applications than shares available. Excess refunded or applied to allotment.
- **Undersubscribed:** Fewer applications than shares available. Only allotted shares recorded.`,
  },

  // Manufacturing
  {
    id: 'manufacturing-1',
    topicId: 'manufacturing',
    title: 'Manufacturing Account',
    content: `The Manufacturing Account determines the cost of goods manufactured.

**Cost Classification:**

**Direct Costs:**
- Direct Materials
- Direct Labour
- Direct Expenses
- **Prime Cost** = Direct Materials + Direct Labour + Direct Expenses

**Indirect Manufacturing Costs (Factory Overheads):**
- Factory rent
- Factory power and lighting
- Depreciation of factory equipment
- Indirect labour

**Production Cost = Prime Cost + Factory Overheads**

**Manufacturing Account Format:**
| | Sh | Sh |
|---|-----|-----|
| Direct Materials: | | |
| Opening stock | XX | |
| Add: Purchases | XX | |
| Less: Closing stock | (XX) | XX |
| Direct Labour | | XX |
| Direct Expenses | | XX |
| **Prime Cost** | | **XX** |
| Factory Overheads: | | |
| (List various overheads) | | XX |
| **Production Cost** | | **XX** |
| Add: Opening WIP | | XX |
| Less: Closing WIP | | (XX) |
| **Cost of Goods Manufactured** | | **XX** |`,
  },

  // Non-Profit
  {
    id: 'nonprofit-1',
    topicId: 'nonprofit',
    title: 'Non-Profit Organizations',
    content: `Non-profit organizations prepare:
1. Receipts and Payments Account
2. Income and Expenditure Account
3. Statement of Financial Position

**Receipts and Payments Account:**
- Summary of cash transactions
- Similar to cash book
- Records all receipts and payments

**Income and Expenditure Account:**
- Similar to Profit and Loss Account
- Matches income and expenditure for the period
- Surplus = Excess of income over expenditure
- Deficit = Excess of expenditure over income

**Types of Funds:**

**1. Subscriptions:**
- Recurring income from members
- Adjusted for amounts in advance/arrears

**2. Donations:**
- Specific donations: Capitalized (for specific purpose)
- General donations: Small amounts = income, Large amounts = capital

**3. Grants:**
- Revenue grants: Treated as income
- Capital grants: Capitalized

**4. Legacy:**
- Amount received per will of deceased
- Usually capitalized

**5. Entrance Fees:**
- Fee on admission of members
- Can be treated as income or capitalized`,
  },

  // Errors
  {
    id: 'errors-1',
    topicId: 'errors',
    title: 'Types of Accounting Errors',
    content: `**Errors NOT Affecting Trial Balance:**

**1. Errors of Omission:**
Transaction completely omitted from books.

**2. Errors of Principle:**
Transaction entered in wrong class of account (e.g., asset debited to expense).

**3. Errors of Commission:**
Correct amount entered in wrong person's account within same class.

**4. Compensating Errors:**
Errors that cancel each other out.

**5. Errors of Original Entry:**
Incorrect original figure used, but double entry observed.

**6. Complete Reversal of Entries:**
Correct amount posted to correct account but wrong side.

**7. Transposition Errors:**
Wrong sequence of characters (e.g., 870 entered as 780).

**Errors AFFECTING Trial Balance:**
- One-sided omissions
- Incorrect amount on one side
- Posting to wrong side of account
- Calculation errors

**Suspense Account:**
Temporary account opened when trial balance doesn't agree. Difference posted to suspense account until errors are found and corrected.`,
  },
];

export const features: Feature[] = [
  {
    id: 'comprehensive',
    title: 'Comprehensive Study Notes',
    description: 'Access detailed, well-structured accounting notes covering all topics from basic principles to advanced financial reporting.',
    points: ['Topic-by-topic breakdown', 'Clear explanations', 'Real-world examples'],
    image: '/images/logo.jpg',
  },
  {
    id: 'ai',
    title: 'AI-Powered Learning',
    description: 'Get instant answers to your accounting questions with our AI assistant. Perfect for clarifying concepts and exam preparation.',
    points: ['24/7 availability', 'Instant responses', 'Concept clarification'],
    image: '/images/campus-students.jpg',
    reverse: true,
  },
  {
    id: 'practice',
    title: 'Practice & Revision',
    description: 'Reinforce your learning with practice questions, worked examples, and revision materials for each topic.',
    points: ['Worked examples', 'Practice questions', 'Exam preparation'],
    image: '/images/logo.jpg',
  },
];

export const stats: Stat[] = [
  { id: '1', value: '10+', label: 'Accounting Topics' },
  { id: '2', value: '50+', label: 'Study Notes' },
  { id: '3', value: '100+', label: 'Practice Questions' },
  { id: '4', value: '24/7', label: 'AI Assistance' },
];

export const popularTags = [
  'Introduction to Accounting',
  'Financial Statements',
  'Recording Transactions',
  'Depreciation',
  'Partnership Accounts',
  'Company Accounts',
];
