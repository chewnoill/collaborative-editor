import db from "./db";

afterAll(()=>{
  db.$disconnect();
})

test("user can be created", async () => {
  const user = await db.users.create({
    data: {
      name: "test user"
    }
  });
  expect(user.name).toBe("test user");

  const user2 = await db.users.findFirst({
    where: {
      id: user.id
    }
  })

  expect(user2).toEqual(user);
});
