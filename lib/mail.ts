import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY bulunamadı');
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL bulunamadı');
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
    console.log('Doğrulama URL:', verificationUrl);

    const result = await resend.emails.send({
      from: 'noreply@codeizm.com',
      to: email,
      subject: 'E-posta Adresinizi Doğrulayın',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #629584;">E-posta Adresinizi Doğrulayın</h2>
          <p>Merhaba,</p>
          <p>Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; 
                    background-color: #629584; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 20px 0;">
            E-posta Adresimi Doğrula
          </a>
          <p>Bu bağlantı 24 saat boyunca geçerlidir.</p>
          <p>Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `
    });

    console.log('E-posta gönderme sonucu:', result);
    return result;
  } catch (error: any) {
    console.error('E-posta gönderme hatası:', error);
    throw new Error(`E-posta gönderilemedi: ${error.message}`);
  }
} 