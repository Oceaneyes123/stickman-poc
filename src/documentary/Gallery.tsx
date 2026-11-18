import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, font } from "../design/tokens";
import { DocumentaryScene } from "./composer";
import {
  CauseEffectSequence,
  DebtCycle,
  FinancialRelationship,
  MoneyFlow,
  ProcessDiagram,
} from "./diagrams";
import {
  DocumentComparison,
  DocumentViewer,
  ReceiptViewer,
  SourceCitation,
  StatementViewer,
} from "./evidence";
import {
  BankCardObject,
  BillAndReceiptObject,
  DocumentaryCalendar,
  InstallmentCardStack,
  ProductCardObject,
  ProductIllustration,
} from "./objects";
import {
  ContextualAnnotation,
  DocumentarySectionHeading,
  ExplanatoryCallout,
  FinancialLabelCard,
  SelectiveEmphasisText,
} from "./typography";
import {
  AccountOverview,
  BankingAppScreen,
  BnplOfferCard,
  CheckoutInterface,
  CreditCardStatement,
  LoanPaymentBreakdown,
  MobileNotificationStack,
  PaymentStatusModal,
  SubscriptionDashboard,
  TransactionHistory,
} from "./ui";

export const DOCUMENTARY_GALLERY_PANEL = 90;

const PANEL_NAMES = [
  "01 · Composer & Mixed Layers",
  "02 · Banking App & Account Overview",
  "03 · Transaction History & Draft Status",
  "04 · Checkout & BNPL Offer",
  "05 · Subscription Dashboard",
  "06 · Credit Card & Loan Breakdown",
  "07 · Mobile Notifications & Card",
  "08 · Document Viewer & Redactions",
  "09 · Receipt & Statement Viewers",
  "10 · Document Comparison & Citation",
  "11 · MoneyFlow & Process Diagram",
  "12 · DebtCycle Diagram",
  "13 · Relationship & Cause-Effect",
  "14 · Documentary Calendar & Stack",
  "15 · Documentary Typography",
  "16 · Focus Zoom & Continuity",
] as const;

export const DOCUMENTARY_GALLERY_PANELS = PANEL_NAMES;
export const DOCUMENTARY_GALLERY_DURATION =
  PANEL_NAMES.length * DOCUMENTARY_GALLERY_PANEL;

function GalleryChrome({
  title,
  index,
  children,
}: {
  title: string;
  index: number;
  children: ReactNode;
}) {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% 20%, #1F3554 0%, ${C.navy} 75%)`,
        fontFamily: font,
        padding: "48px 96px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          borderBottom: `2px solid ${C.line}`,
          paddingBottom: 14,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800, color: C.white }}>
          <span style={{ color: C.yellow }}>Documentary Gallery</span> · {title}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>
          Panel {index + 1} / {PANEL_NAMES.length}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}

export function DocumentaryGallery() {
  const frame = useCurrentFrame();
  const index = Math.min(
    PANEL_NAMES.length - 1,
    Math.floor(frame / DOCUMENTARY_GALLERY_PANEL),
  );
  const local = frame - index * DOCUMENTARY_GALLERY_PANEL;

  switch (index) {
    case 0:
      return (
        <DocumentaryScene
          frame={local}
          scene={{
            id: "GAL-01",
            title: PANEL_NAMES[0],
            durationInFrames: DOCUMENTARY_GALLERY_PANEL,
            layout: "feature-left",
            backdrop: { preset: "editorial-navy", accentColor: C.teal, gridLines: true },
            layers: [
              {
                id: "gal-01-text",
                kind: "text",
                depth: "foreground",
                region: { x: 96, y: 120, width: 920, height: 600 },
                render: ({ layerFrame }) => (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <DocumentarySectionHeading
                      eyebrow="P0-1 SCENE COMPOSER"
                      title="Layered Documentary Canvas"
                      subtitle="Background, midground, and foreground layers compose deterministically."
                      frame={layerFrame}
                    />
                    <ContextualAnnotation
                      text="96px side safe margins enforced across regions"
                      frame={layerFrame}
                    />
                  </div>
                ),
              },
              {
                id: "gal-01-obj",
                kind: "object",
                depth: "midground",
                region: { x: 1120, y: 180, width: 640, height: 680 },
                render: ({ layerFrame }) => (
                  <ProductCardObject
                    kind="headphones"
                    title="Studio Headphones"
                    fullPrice={160}
                    frame={layerFrame}
                  />
                ),
              },
            ],
          }}
        />
      );
    case 1:
      return (
        <GalleryChrome title={PANEL_NAMES[1]} index={1}>
          <BankingAppScreen
            variant="mobile"
            initialBalance={1420}
            settledBalance={1180}
            reservedUpcoming={120}
            settledReserved={360}
            transitionAt={35}
            activities={[
              { id: "b1", title: "Jacket Draft 1/4", date: "Oct 1", amount: 60, status: "pending", nextStatus: "completed" },
              { id: "b2", title: "Utility Bill", date: "Oct 3", amount: 110, status: "scheduled" },
            ]}
            width={450}
            frame={local}
          />
          <AccountOverview
            accounts={[
              { id: "c1", name: "Checking Balance", role: "checking", amount: 1420, note: "Available" },
              { id: "c2", name: "Emergency Buffer", role: "reserve", amount: 650 },
              { id: "c3", name: "Scheduled BNPL", role: "committed", amount: 340, note: "Next 6 weeks" },
            ]}
            highlightId="c3"
            width={780}
            frame={local}
          />
        </GalleryChrome>
      );
    case 2:
      return (
        <GalleryChrome title={PANEL_NAMES[2]} index={2}>
          <TransactionHistory
            transactions={[
              { id: "t1", merchant: "Mercer & Loom", category: "Installment", date: "Oct 1", amount: 60, status: "pending", nextStatus: "completed" },
              { id: "t2", merchant: "StreamVault", category: "Subscription", date: "Oct 5", amount: 18, recurring: true, status: "completed" },
              { id: "t3", merchant: "SplitPay Draft", category: "Installment", date: "Oct 15", amount: 60, status: "scheduled", nextStatus: "failed" },
            ]}
            transitionAt={36}
            startingBalance={480}
            highlightId="t3"
            width={800}
            frame={local}
          />
          <PaymentStatusModal
            merchant="SplitPay · Draft #2"
            amount={60}
            dateLabel="Oct 15 scheduled debit"
            outcome="failed"
            transitionAt={36}
            width={430}
            frame={local}
          />
        </GalleryChrome>
      );
    case 3:
      return (
        <GalleryChrome title={PANEL_NAMES[3]} index={3}>
          <CheckoutInterface
            productName="Canvas Field Jacket"
            productArt={<ProductIllustration kind="jacket" size={88} />}
            fullPrice={240}
            selectBnplAt={24}
            revealObligationsAt={48}
            highlightId="pay-bnpl"
            width={760}
            frame={local}
          />
          <BnplOfferCard
            itemTitle="Canvas Field Jacket"
            totalPrice={240}
            revealFutureAt={20}
            width={460}
            frame={local}
          />
        </GalleryChrome>
      );
    case 4:
      return (
        <GalleryChrome title={PANEL_NAMES[4]} index={4}>
          <SubscriptionDashboard
            subscriptions={[
              { id: "s1", service: "Cloud Storage Plus", renewalDay: "3rd monthly", monthlyAmount: 12, status: "active" },
              { id: "s2", service: "StreamVault Video", renewalDay: "10th monthly", monthlyAmount: 18, status: "active" },
              { id: "s3", service: "AudioBox Music", renewalDay: "17th monthly", monthlyAmount: 15, status: "active" },
              { id: "s4", service: "FitTrack Pro", renewalDay: "24th monthly", monthlyAmount: 25, status: "active" },
            ]}
            showAnnualAt={32}
            highlightId="s4"
            width={880}
            frame={local}
          />
        </GalleryChrome>
      );
    case 5:
      return (
        <GalleryChrome title={PANEL_NAMES[5]} index={5}>
          <CreditCardStatement
            statementDate="Sep 30"
            dueDate="Oct 25"
            balance={2400}
            annualRate={0.22}
            fixedAlternativePayment={160}
            revealComparisonAt={22}
            width={760}
            frame={local}
          />
          <LoanPaymentBreakdown
            principal={6000}
            annualRate={0.09}
            months={36}
            width={740}
            frame={local}
          />
        </GalleryChrome>
      );
    case 6:
      return (
        <GalleryChrome title={PANEL_NAMES[6]} index={6}>
          <MobileNotificationStack
            notifications={[
              { id: "n1", app: "SplitPay", title: "Upcoming draft", detail: "Jacket · 2 of 4", amount: 60, timeLabel: "8:00 AM", tone: "warning" },
              { id: "n2", app: "Harbor Bank", title: "Low buffer alert", detail: "Balance near scheduled bills", timeLabel: "9:30 AM", tone: "urgent", revealAt: 22 },
            ]}
            width={480}
            frame={local}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <BankCardObject brand="Cedar Bank" label="Debit Card ··4108" tone="navy" frame={local} />
            <BillAndReceiptObject
              items={[
                { label: "Electric & Water", amount: 145 },
                { label: "Internet", amount: 65 },
              ]}
              paid={local > 45}
              frame={local}
            />
          </div>
        </GalleryChrome>
      );
    case 7:
      return (
        <GalleryChrome title={PANEL_NAMES[7]} index={7}>
          <DocumentViewer
            title="Installment Terms Summary"
            subtitle="Example fee & scheduling clause"
            authenticity="recreated-example"
            source="Editorial Terms Recreation"
            date="2026-11-18"
            scopeNote="Hypothetical example illustrating automatic payment scheduling."
            activeClauseId="c2"
            zoomAt={30}
            pageIndex={1}
            totalPages={2}
            clauses={[
              { id: "c1", heading: "Account Holder", text: "Customer details", redacted: true },
              {
                id: "c2",
                heading: "Section 3 · Automatic Drafts",
                text: "Four equal installments draft every 14 days from the linked payment method regardless of separate retail plans.",
                highlightAt: 16,
                callout: "Drafts stack independently",
              },
            ]}
            width={920}
            height={520}
            frame={local}
          />
        </GalleryChrome>
      );
    case 8:
      return (
        <GalleryChrome title={PANEL_NAMES[8]} index={8}>
          <ReceiptViewer
            merchant="Mercer & Loom"
            receiptDate="Oct 1"
            items={[{ id: "j", label: "Canvas Field Jacket", amount: 240 }]}
            dueToday={60}
            deferredAmount={180}
            width={480}
            frame={local}
          />
          <StatementViewer
            institution="Cedar Card"
            statementTitle="Monthly Statement"
            billingPeriod="Sep 1 – Sep 30"
            authenticity="fictional-illustration"
            sections={[
              { id: "s1", label: "Previous Balance", value: 1850 },
              { id: "s2", label: "Minimum Payment Due", value: 65, tone: "cost" },
            ]}
            finePrintClause="Paying only the minimum increases total interest over extended billing cycles."
            focusFinePrintAt={28}
            width={740}
            frame={local}
          />
        </GalleryChrome>
      );
    case 9:
      return (
        <GalleryChrome title={PANEL_NAMES[9]} index={9}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
            <DocumentComparison
              left={{
                title: "Checkout Headline",
                headlineLabel: "Due Today",
                headlineValue: "$60",
                tone: "emphasis",
                lines: ["Immediate cash impact", "Prominent checkout CTA"],
              }}
              right={{
                title: "Full Repayment",
                headlineLabel: "Total Obligation",
                headlineValue: "$240",
                tone: "obligation",
                lines: ["4 drafts across 6 weeks", "Shares cash with monthly bills"],
              }}
              differenceSummary="Same total price, distributed across future dates."
              width={1120}
              frame={local}
            />
            <SourceCitation
              source="Money Trap Demo Model"
              title="Pay-in-4 Scenario"
              date="2026-11-18"
              authenticity="fictional-illustration"
              frame={local}
            />
          </div>
        </GalleryChrome>
      );
    case 10:
      return (
        <GalleryChrome title={PANEL_NAMES[10]} index={10}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
            <MoneyFlow
              nodes={[
                { id: "card", label: "Card Swipe", amount: 60, x: 140, y: 120, tone: "money" },
                { id: "proc", label: "Processor Hold", amount: 60, x: 480, y: 120, tone: "neutral" },
                { id: "merch", label: "Merchant Payout", amount: 240, x: 860, y: 120, tone: "alternative" },
              ]}
              edges={[
                { id: "e1", from: "card", to: "proc", meaning: "transfer", label: "Draft 1", revealedAt: 10 },
                { id: "e2", from: "proc", to: "merch", meaning: "obligation", label: "3 future drafts", revealedAt: 26 },
              ]}
              width={1020}
              height={260}
              frame={local}
            />
            <ProcessDiagram
              title="Card Settlement vs Installment Split"
              stages={[
                { id: "p1", stepNumber: 1, title: "Authorize", amount: 60, tone: "money", revealedAt: 12 },
                { id: "p2", stepNumber: 2, title: "Schedule 3 Drafts", amount: 180, tone: "cost", revealedAt: 28 },
                { id: "p3", stepNumber: 3, title: "Total Settled", amount: 240, tone: "alternative", revealedAt: 44 },
              ]}
              width={1020}
              frame={local}
            />
          </div>
        </GalleryChrome>
      );
    case 11:
      return (
        <GalleryChrome title={PANEL_NAMES[11]} index={11}>
          <DebtCycle
            title="How Minimum Payments Extend Balances"
            centerLabel="Carried Balance"
            centerDetail="Interest accrues monthly"
            steps={[
              { id: "d1", label: "Minimum Payment", detail: "Covers small principal", tone: "money" },
              { id: "d2", label: "Interest Added", detail: "Raises next balance", tone: "cost" },
              { id: "d3", label: "Less Free Cash", detail: "Tighter budget buffer", tone: "cost" },
              { id: "d4", label: "Repeat Reliance", detail: "New charges roll over", tone: "cost" },
            ]}
            width={820}
            height={560}
            frame={local}
          />
        </GalleryChrome>
      );
    case 12:
      return (
        <GalleryChrome title={PANEL_NAMES[12]} index={12}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <FinancialRelationship
              title="Recurring Plans Drawing From Monthly Cash"
              sources={[
                { id: "r1", label: "Subscriptions", amount: 70, revealedAt: 6 },
                { id: "r2", label: "Scheduled Installments", amount: 200, revealedAt: 20 },
              ]}
              targetLabel="Monthly Net Pay"
              targetAmount={3000}
              width={1040}
              frame={local}
            />
            <CauseEffectSequence
              chain={[
                { id: "c1", role: "Trigger", headline: "Low Upfront Draft", detail: "Easy purchase approval", revealedAt: 10 },
                { id: "c2", role: "Mechanism", headline: "Overlapping Dates", detail: "Multiple bills align", revealedAt: 28 },
                { id: "c3", role: "Consequence", headline: "Reduced Flexibility", detail: "Tighter month-end cash", revealedAt: 46 },
              ]}
              width={1040}
              frame={local}
            />
          </div>
        </GalleryChrome>
      );
    case 13:
      return (
        <GalleryChrome title={PANEL_NAMES[13]} index={13}>
          <DocumentaryCalendar
            monthLabel="October — Schedule Collision"
            daysCount={28}
            events={[
              { id: "e1", dayOfMonth: 1, label: "Jacket 1/4", amount: 60, category: "bnpl", revealedAt: 6 },
              { id: "e2", dayOfMonth: 15, label: "Jacket 2/4", amount: 60, category: "bnpl", revealedAt: 18 },
              { id: "e3", dayOfMonth: 15, label: "Auto Service", amount: 380, category: "repair", revealedAt: 32 },
            ]}
            width={760}
            frame={local}
          />
          <InstallmentCardStack
            itemTitle="Jacket"
            total={240}
            splitAt={14}
            width={620}
            frame={local}
          />
        </GalleryChrome>
      );
    case 14:
      return (
        <GalleryChrome title={PANEL_NAMES[14]} index={14}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 1120 }}>
            <DocumentarySectionHeading
              eyebrow="TYPOGRAPHY SYSTEM"
              title="Hierarchy, Callouts & Emphasis"
              subtitle="Short purposeful labels instead of sentence walls."
              frame={local}
            />
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <FinancialLabelCard
                label="Full Commitment"
                amount={240}
                unitOrPeriod="across 6 weeks"
                tone="cost"
                frame={local}
              />
              <ExplanatoryCallout
                title="Why contrast matters"
                detail="High-contrast boards keep 0.5x previews and phone views readable."
                frame={local}
              />
            </div>
            <SelectiveEmphasisText
              text="Four small payments still equal one full price."
              emphasis="full"
              emphasisColor={C.yellow}
              frame={local}
            />
          </div>
        </GalleryChrome>
      );
    default:
      return (
        <DocumentaryScene
          frame={local}
          scene={{
            id: "GAL-16",
            title: PANEL_NAMES[15],
            durationInFrames: DOCUMENTARY_GALLERY_PANEL,
            layout: "single",
            backdrop: { preset: "dark-evidence", accentColor: C.yellow },
            focusTargets: [
              {
                id: "gal-focus",
                rect: { x: 560, y: 170, width: 800, height: 670 },
                from: 18,
                until: 78,
                zoom: 1.08,
                dimOpacity: 0.45,
                callout: "Focus camera isolates key clause or UI row",
                color: C.yellow,
              },
            ],
            layers: [
              {
                id: "gal-16-card",
                kind: "ui",
                depth: "midground",
                region: { x: 570, y: 190, width: 780, height: 650 },
                render: ({ layerFrame }) => (
                  <BnplOfferCard
                    itemTitle="Continuity & Focus Example"
                    totalPrice={240}
                    width={780}
                    frame={layerFrame}
                  />
                ),
              },
            ],
          }}
        />
      );
  }
}
