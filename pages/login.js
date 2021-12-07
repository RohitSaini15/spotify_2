import { getProviders, signIn } from "next-auth/react";

export default function Login({ providers }) {

  return (
    <div className="flex flex-col bg-black min-h-screen justify-center items-center">
      <img
        className="w-52 mb-5"
        src="https://links.papareact.com/9xl"
        alt=""
      ></img>

      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="text-white bg-[#18D860] p-5 rounded-lg"
            >
              Login with {provider.name}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
