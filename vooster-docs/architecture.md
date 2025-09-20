# Technical Requirements Document (TRD)
  
## Tech Stack

Next.js 15, Typescript, TailwindCSS, shadcn, lucide-react, @tanstack/react-query, supabase(postgresql), OpenAI API, PHP(만세력), Vercel, date-fns, es-toolkit

## Directory Structure


/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # common components
│   │   └── ui/                 # shadcn/ui components
│   ├── features/               # custom hooks (handle business logic)
│   │   └── [featureName]/      # feature-based directory
│   │   │   └── components/     # feature-based components
│   │   │   └── hooks/          # feature-based hooks
│   │   │   └── lib/            # feature-based lib
│   │   │   └── pages/          # feature-based page components
│   │   │   └── api.ts          # feature-based api callers
│   │   │   └── schema.ts       # feature-based api schemas (zod)
│   │   │   └── constants.ts    # feature-based constants
│   │   │   └── types.ts        # feature-based types
│   │   │   └── utils.ts        # feature-based utils
│   │   └── ...                 # other features
│   ├── hooks/                  # common hooks
│   ├── lib/                    
│   │   └── utils.ts            # shadcn cn utility function
├── public/                     # static assets
└── supabase/migrations         # supabase migrations (0000_name.sql)

  