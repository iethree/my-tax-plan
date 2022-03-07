import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mx-5 border-opacity-20 p-3 mt-2 text-sm flex justify-between">
      <div>
        <a href="https://github.com/iethree/my-tax-plan">
          <i className="fab fa-github mr-2" />
          MyTaxPlan is open source
        </a>
      </div>
      <div>
        <Link href="/methodology">methodology</Link>
      </div>
    </footer>
  );
}
