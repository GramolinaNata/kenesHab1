// shared/types/next-auth.d.ts
import { ILoginOut } from "@/features/authentication";
import type {DefaultSession} from "next-auth";

declare module "next-auth" {
	
	interface IUser {
		id?: string;
		name?: string | null;
		email?: string | null;
		loginOut: ILoginOut;
		access_token: {
			token: string;
			expires_at: string;
		};
		is_superuser?: boolean;
		refresh_token?: string;
	}

	interface Session extends DefaultSession {
		user: IUser;
		access: string;

	}
}

declare module "next-auth/jwt" {
	interface JWT {
		access: string;
		refresh?: string;
		user: import("next-auth").IUser;
	}
}
