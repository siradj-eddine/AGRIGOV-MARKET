export default function NotAllowed() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
      <p className="text-gray-500 mt-2">
        You do not have permission to access this page.
      </p>
    </div>
  );
}