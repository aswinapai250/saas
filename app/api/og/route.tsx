import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Read parameters from URL
    const name = searchParams.get('name');
    const bio = searchParams.get('bio');
    const photo = searchParams.get('photo');
    const username = searchParams.get('username');

    // Default values if parameters are missing
    const displayName = name || username || 'BioLink User';
    const displayBio = bio || 'Connect with me on BioLink';
    
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
            padding: '40px',
          }}
        >
          {/* Profile Image Wrap */}
          <div
            style={{
              display: 'flex',
              marginBottom: '30px',
              borderRadius: '100%',
              padding: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {photo ? (
              <img
                src={photo}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '100%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {displayName[0].toUpperCase()}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 10,
              textAlign: 'center',
            }}
          >
            {displayName}
          </div>
          
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '800px',
              marginBottom: 40,
            }}
          >
            {displayBio}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '99px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: 'white',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'black',
                color: 'black',
              }}
            >
              B
            </div>
            <div
              style={{
                fontSize: 20,
                color: 'white',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
              }}
            >
              BIOLINK
            </div>
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
