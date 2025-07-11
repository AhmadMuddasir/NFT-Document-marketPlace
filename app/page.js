"use client";
import { useStateContext } from "@/Context/NFTs";
import {
  Logo,
  Button,
  Card,
  Footer,
  CheckBox,
  Filter,
  Donate,
  Form,
  Profile,
  Login,
  Header,
  SignUp,
  Upload,
  Product,
} from "@/Components";
export default function Home() {
  return (
    <div className="home">
      <Header />
      <Product />
      {/* <Logo /> */}
      <Button />
      <Upload />
      <Card />
      <Filter />
      <Donate />
      <Form />
      <Login />
      <SignUp />
      <Profile />
      <CheckBox />
      <Footer />
    </div>
  );
}
