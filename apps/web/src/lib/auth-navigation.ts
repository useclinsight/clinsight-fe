type AuthRouter = {
  back: () => void;
  push: (href: string) => void;
};

export function createAuthBackHandlers(router: AuthRouter) {
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/login');
  };

  return {
    handleBack,
  };
}
