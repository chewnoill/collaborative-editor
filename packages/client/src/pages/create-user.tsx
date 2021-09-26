import React from "react";
import { CreateUserForm } from "components/user-form";
import { SimpleLayout } from "layout/app";

export default function CreateUserPage() {
  return (
    <SimpleLayout>
      <CreateUserForm />
    </SimpleLayout>
  );
}
