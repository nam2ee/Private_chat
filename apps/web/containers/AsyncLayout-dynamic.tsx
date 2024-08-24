import dynamic from "next/dynamic";

export default dynamic(() => import("./AsyncLayout"), {
  ssr: false,
});
