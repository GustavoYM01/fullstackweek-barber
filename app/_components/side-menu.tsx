"use client";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const SideMenu = () => {
  const { data, status } = useSession();
  return (
    <>
      <SheetHeader className="text-left border-b border-solid border-secondary p-5">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>
      {data?.user ? (
        <div className="flex justify-between px-5 py-6 items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={data.user.image ?? ""} />
            </Avatar>
            <h2 className="font-bold">{data.user.name}</h2>
          </div>
          <Button variant="secondary" size="icon">
            <LogOutIcon onClick={() => signOut()} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 py-6">
          <div className="flex items-center gap-2">
            <Image
              src={"/circle-user-round.png"}
              alt=""
              width={30}
              height={30}
            />
            <h2 className="font-bold">Olá, faça o seu login</h2>
          </div>
          <Button
            variant={"secondary"}
            className="w-full justify-start"
            onClick={() => signIn("google")}
          >
            <LogInIcon className="mr-2" size={18} />
            Fazer Login
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-3 px-5">
        <Button variant={"outline"} className="justify-start" asChild>
          <Link href={"/"}>
            <HomeIcon size={18} className="mr-2" />
            Início
          </Link>
        </Button>
        {data?.user && (
          <Button variant={"outline"} className="justify-start">
            <CalendarIcon size={18} className="mr-2" />
            <Link href={"/bookings"}>Agendamentos</Link>
          </Button>
        )}
      </div>
    </>
  );
};

export default SideMenu;
