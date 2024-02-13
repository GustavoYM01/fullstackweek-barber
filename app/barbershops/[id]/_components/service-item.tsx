"use client";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Barbershop, Service } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { generateDayTimeList } from "./_helpers/hours";
import { saveBooking } from "../_actions/save-booking";
import { setHours, setMinutes } from "date-fns";
import { Loader2 } from "lucide-react";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({
  service,
  isAuthenticated,
  barbershop,
}: ServiceItemProps) => {
  const { data } = useSession();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);

  const showDate = (data: Date | undefined) => {
    if (data !== undefined) {
      const date = data
        .toLocaleString("pt-BR", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
        .replace("-feira", "");

      const nameOfMonth =
        date.split("de")[1].substring(1, 2).toUpperCase() +
        date.split("de")[1].substring(2);
      return `${data.getDate()} de ${nameOfMonth}`;
    }
  };
  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };
  const handleClickHour = (time: string) => {
    setHour(time);
  };
  const handleBooking = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };
  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !data?.user) return;
      const newDate = setMinutes(
        setHours(date, Number(hour.split(":")[0])),
        Number(hour.split(":")[1])
      );
      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate as any,
        userId: (data.user as any).id,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }
  };
  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : [];
  }, [date]);
  return (
    <Card>
      <CardContent className="p-3 w-full">
        <div className="flex gap-4 items-center w-full">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              className="rounded-lg"
              src={service.imageUrl}
              fill
              style={{ objectFit: "contain" }}
              alt={service.name}
            />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              {isAuthenticated ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant={"secondary"} onClick={handleBooking}>
                      Reservar
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="p-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                      <SheetTitle>Fazer Reserva</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateClick}
                        locale={ptBR}
                        fromDate={new Date()}
                        styles={{
                          head_cell: {
                            width: "100%",
                            textTransform: "capitalize",
                          },
                          cell: {
                            width: "100%",
                          },
                          button: {
                            width: "100%",
                          },
                          nav_button_previous: {
                            width: "32px",
                            height: "32px",
                          },
                          nav_button_next: {
                            width: "32px",
                            height: "32px",
                          },
                          caption: {
                            textTransform: "capitalize",
                          },
                        }}
                      />
                    </div>
                    {date && (
                      <div className="flex gap-3 overflow-x-auto py-6 px-5 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">
                        {timeList.map((time) => (
                          <Button
                            variant={hour === time ? "default" : "outline"}
                            className="rounded-full"
                            key={time}
                            onClick={() => handleClickHour(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="py-6 px-5 border-t border-solid border-secondary">
                      <Card>
                        <CardContent className="flex flex-col gap-3 p-3">
                          <div className="flex items-center justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <h3 className="font-bold text-sm">
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(service.price))}
                            </h3>
                          </div>
                          {date && (
                            <div className="flex justify-between">
                              <h3 className="text-gray-400 text-sm">Data</h3>
                              <h4 className="text-sm">{showDate(date)}</h4>
                            </div>
                          )}
                          {hour && (
                            <div className="flex justify-between">
                              <h3 className="text-gray-400 text-sm">Horário</h3>
                              <h4 className="text-sm">{hour}</h4>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Barbearia</h3>
                            <h4 className="text-sm">{barbershop.name}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <SheetFooter className="px-5">
                      <Button
                        onClick={handleBookingSubmit}
                        disabled={!hour || !date || submitIsLoading}
                      >
                        {submitIsLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirmar reserva
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button variant={"secondary"} onClick={handleBooking}>
                  Reservar
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
