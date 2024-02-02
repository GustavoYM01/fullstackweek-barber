import Image from "next/image";
import Header from "../_components/header";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";

export default function Home() {
  const showDate = () => {
    const date = new Date()
      .toLocaleString("pt-BR", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
      .replace("-feira", "");
    const nameOfWeek =
      date.split(",")[0].substring(1, -1).toUpperCase() +
      date.split(",")[0].substring(1);
    const nameOfMonth =
      date.split("de")[1].substring(1, 2).toUpperCase() +
      date.split("de")[1].substring(2);
    return `${nameOfWeek}, ${new Date().getDate()} de ${nameOfMonth}`;
  };
  return (
    <div>
      <Header />
      <div className="px-5 py-5">
        <h2 className="text-xl">
          Olá, <b>Miguel!</b>
        </h2>
        <span className="text-sm">{showDate()}</span>
      </div>
      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-xs mb-3 uppercase text-gray-400 font-bold">
          Agendamentos
        </h2>
        <BookingItem />
      </div>
    </div>
  );
}
