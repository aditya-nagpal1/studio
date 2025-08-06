import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2962FF',
          borderRadius: '8px',
        }}
      >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="m16 16-4-4-4 4"></path>
            <path d="m6 2 8.5 8.5"></path>
            <path d="M12 2v4"></path>
            <path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"></path>
            <path d="M12 12a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"></path>
            <path d="M22 22 13.5 13.5"></path>
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      ...size,
    }
  )
}
