import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductStrip from '../components/ProductStrip';
import ProductIntro from '../components/ProductIntro';
import ModuleGrid from '../components/ModuleGrid';
import IntelligenceSection from '../components/IntelligenceSection';
import MobileSection from '../components/MobileSection';
import WorkflowSection from '../components/WorkflowSection';
import ConnectedHospital from '../components/ConnectedHospital';
import HospitalTeams from '../components/HospitalTeams';
import AnalyticsSection from '../components/AnalyticsSection';
import SecuritySection from '../components/SecuritySection';
import WhyHMS from '../components/WhyHMS';
import DoctorPortalSection from '../components/DoctorPortalSection';
import DepartmentsSection from '../components/DepartmentsSection';
import RevenueSection from '../components/RevenueSection';
import PharmacySection from '../components/PharmacySection';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import ScrollExtras from '../components/ScrollExtras';
import { ScrollExpand, SectionRise } from '../components/motion';
import ScrollBand from '../components/ScrollBand';

export default function Home() {
  useEffect(() => {
    document.title = 'HospAI | The Operating System for Modern Hospitals';
  }, []);
  return (
    <div className="overflow-x-clip">
      <ScrollExtras />
      <Navbar />
      <main>
        <Hero />
        <ProductStrip />
        <SectionRise><ProductIntro /></SectionRise>
        <SectionRise><ModuleGrid /></SectionRise>
        <ScrollBand
          rowA={['Emergency', 'Inpatient', 'ICU', 'Surgery', 'Pharmacy', 'Laboratory']}
          rowB={['Billing', 'Insurance', 'Nursing', 'Radiology', 'Reception', 'Analytics']}
        />
        <SectionRise><DoctorPortalSection /></SectionRise>
        <ScrollExpand><IntelligenceSection /></ScrollExpand>
        <SectionRise><DepartmentsSection /></SectionRise>
        <SectionRise><PharmacySection /></SectionRise>
        <SectionRise><MobileSection /></SectionRise>
        <SectionRise><WorkflowSection /></SectionRise>
        <ScrollExpand><ConnectedHospital /></ScrollExpand>
        <SectionRise><HospitalTeams /></SectionRise>
        <SectionRise><RevenueSection /></SectionRise>
        <SectionRise><AnalyticsSection /></SectionRise>
        <SectionRise><SecuritySection /></SectionRise>
        <ScrollExpand><WhyHMS /></ScrollExpand>
        <SectionRise><FAQ /></SectionRise>
        <ScrollBand
          rowA={['Connected', 'Intelligent', 'Secure', 'Real-time']}
          rowB={['One record', 'Every team', 'Web & mobile', 'AI inside']}
        />
        <ScrollExpand><FinalCTA /></ScrollExpand>
      </main>
      <Footer />
    </div>
  );
}
