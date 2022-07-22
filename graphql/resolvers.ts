import prisma from "../lib/prisma";

export const resolvers = {
    Query: {
        tasks: async(parent, args, ctx) => await ctx.prisma.task.findMany()
    }
}