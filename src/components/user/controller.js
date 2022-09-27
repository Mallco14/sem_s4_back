import { PrismaClient } from "@prisma/client";
import Pusher from "pusher";

const prisma = new PrismaClient();

const pusher = new Pusher({
    appId: "1482592",
    key: "628c8373fa4dd77b4f8b",
    secret: "7f60d2665793d06c1e41",
    cluster: "us3",
    useTLS: true
  });

export const findAll = async (_req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.json({
            ok: true,
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            data: error.message,
        });
    }
}
const findOne = async (email) => {
    try {
        return await prisma.user.findFirst({ where: { email } });
    } catch (error) {
        return null;
    }
};

export const store = async (req, res) => {
    try {
        const { body } = req;

        const userByEmail = await findOne(body.email);

        if (userByEmail) {
            return res.json({
                ok: true,
                data: userByEmail,
            });
        }

        body.profile_url = `https://avatars.dicebear.com/api/avataaars/${body.name}.svg`;

        const user = await prisma.user.create({
            data: {
                ...body,
            },
        });

        pusher.trigger("my-channel", "my-event", {
            message: "Call to update list contacts"
          });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            data: error.message,
        });
    }
};