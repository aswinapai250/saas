import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              backgroundImage: 'radial-gradient(circle at 25px 25px, #e2e8f0 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e2e8f0 2%, transparent 0%)',
              backgroundSize: '100px 100px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 60,
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: 20,
              }}
            >
              BioLink
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                color: '#64748b',
              }}
            >
              Create your free bio link page
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 100,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 20,
              padding: '0 40px',
              textAlign: 'center',
            }}
          >
            @{username}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#94a3b8',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            BioLink Personal Profile
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 60,
              display: 'flex',
              fontSize: 24,
              color: '#38bdf8',
              fontWeight: 'bold',
            }}
          >
            saas-biolink.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
