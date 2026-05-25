callbacks: {
    async signIn({ user }) {
        // server এ token generate করতে বলো
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: user.email, name: user.name }),
        });
        return true;
    },
    async session({ session }) {
        return session;
    },
}