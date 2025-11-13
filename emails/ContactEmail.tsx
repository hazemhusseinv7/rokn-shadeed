import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email?: string;
  phone: string;
  message: string;
}

export const ContactEmail = ({
  name,
  email,
  phone,
  message,
}: ContactEmailProps) => {
  return (
    <Html dir="rtl">
      <Head />
      <Tailwind>
        <Preview>رسالة جديدة من {name}</Preview>
        <Body>
          <Container className="mx-auto max-w-2xl p-6">
            <Heading className="mb-4 text-2xl font-bold text-zinc-800">
              رسالة جديدة
            </Heading>

            <Section className="mb-6">
              <Text className="text-lg font-semibold text-zinc-800">
                التفاصيل:
              </Text>
              <Text className="text-zinc-700">
                <strong>الإسم:</strong> {name}
              </Text>

              {email && (
                <Text className="text-zinc-700">
                  <strong>البريد الإلكتروني:</strong> {email}
                </Text>
              )}

              {phone && (
                <Text className="text-zinc-700">
                  <strong>رقم الهاتف:</strong> {phone}
                </Text>
              )}
            </Section>

            <Section>
              <Text className="text-lg font-semibold text-zinc-800">
                الرسالة:
              </Text>
              <Text className="rounded-lg border border-zinc-200 bg-zinc-100 p-4 text-zinc-700">
                {message}
              </Text>
            </Section>

            <Section className="mt-8 border-t border-zinc-200 pt-6">
              <Text className="text-sm text-zinc-500">
                تم إرسال هذا البريد الإلكتروني من نموذج التواصل في الموقع
                الإلكترونى.
              </Text>
              <Text className="mt-2 text-sm text-zinc-500">
                تاريخ الإرسال: {new Date().toLocaleDateString()}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactEmail;
