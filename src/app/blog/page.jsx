import styles from "./homepage.module.css";
import CategoryList from "@/components/categoryList/CategoryList";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import Featured from "@/components/featured/Featured";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";

export default function Home({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;

  return (
    <div className={styles.container}>
      <Featured item={page} />
      <CategoryList />
      <div className={styles.content}>
        <CardList page={page}/>
        <Menu />
      </div>
    </div>
  );
}
