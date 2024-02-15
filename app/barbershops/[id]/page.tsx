import { db } from "@/app/_lib/prisma";
import BarberShopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions);
  if (!params.id) {
    return null;
  }
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });
  if (!barbershop) {
    return null;
  }
  return (
    <div>
      <BarberShopInfo barbershop={barbershop} />
      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service: any) => (
          <ServiceItem
            key={service.id}
            service={service}
            isAuthenticated={!!session?.user}
            barbershop={barbershop}
          />
        ))}
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;
