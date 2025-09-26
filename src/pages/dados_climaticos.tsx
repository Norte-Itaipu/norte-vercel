import Head from "next/head";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Header from "@/components/Header";
import Strings from "@/util/Strings";

const DadosClimaticos: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <Head>
        <title>{Strings.norteTitlePageMetrics}</title>
      </Head>

      <ScrollToTopButton text={Strings.voltarTopo} />
    </div>
  );
};

export default DadosClimaticos;
