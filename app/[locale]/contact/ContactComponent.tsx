"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { addToast, Button, Card, Input, Textarea } from "@heroui/react";
import { cn } from "@/lib/utils";

interface FormDataType {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}

const ContactComponent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const t = useTranslations("Contact");

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        addToast({
          title: t("messages.success.title"),
          description: t("messages.success.description"),
          color: "success",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        throw new Error(t("messages.error.title"));
      }
    } catch (error) {
      addToast({
        title: t("messages.error.title"),
        description: t("messages.error.description"),
        color: "danger",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <TextEffect
        per="word"
        as="h1"
        preset="blur"
        speedReveal={0.3}
        speedSegment={0.3}
        className="mx-auto text-2xl lg:text-4xl"
      >
        {t("title")}
      </TextEffect>

      <Card className="mx-auto w-full max-w-120 p-4 shadow-2xl shadow-zinc-300 dark:shadow-zinc-900">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label={t("form.name")}
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
          <Input
            label={t("form.email")}
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <Input
            label={t("form.phone")}
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          <Textarea
            label={t("form.message")}
            minRows={4}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            required
          />
          <Button type="submit" color="primary" disabled={isLoading}>
            {t("form.button")}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ContactComponent;
