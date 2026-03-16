import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'VitaLab · Sistema de Fórmulas Manipuladas';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 128,
            marginBottom: 24,
            display: 'flex',
          }}
        >
          🌿
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#166534',
            textAlign: 'center',
            letterSpacing: '-0.05em',
          }}
        >
          VitaLab
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#15803d',
            opacity: 0.8,
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          Sistema de Fórmulas Manipuladas
        </div>
        <div
            style={{
                position: 'absolute',
                bottom: 40,
                fontSize: 20,
                color: '#15803d',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em'
            }}
        >
            Premium & Personalizado
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
