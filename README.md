# Finance Manager

## How to run

Requirements:

- NodeJS >18
- [pNPM](https://pnpm.io/) >9 (You can use NPM as well, use `npm` instead of `pnpm` in the commands below)
- Python 3
- [UV](https://github.com/astral-sh/uv)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- Docker

Clone the repository and install all the dependencies:

```shell
pnpm install

cd api/
uv sync
```

The next step is to setup Supabase. Run `pnpm run start` and then `pnpm run schema:migrate`.

**Environment**
Rename **.env.example** to **.env** and fill in all the fields in there. If you have successfully started Supabase, you can see the required fields with the command

```shell
supabase status
```

The _API_URL_ will be the base URL of the python server (by default is http://localhost:8000)

You will need to run 2 separate processes:

- Next Application with `pnpm run dev` in the project root
- Python API with `uv run index.py` in the **api** directory

If everything's okay and ports **3000** and **8000** are free, you can open the application `http://localhost:3000`

## Documentation & Thoughts

Everything related to models will be inside corresponding folders readme.
