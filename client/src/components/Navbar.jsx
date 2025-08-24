import { Bell, User, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ setSidebarOpen }) {
  const { accounts, currentUser } = useSelector((state) => state.auth);
  const [toggleView, setToggleView] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
      <div>d</div>
      {/* Right Section */}
      <div className="flex items-center gap-3 relative">
        <div
          className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer"
          onClick={() => setToggleView((p) => !p)}
        >
          <User className="w-4 h-4 text-white" />
        </div>

        {toggleView && (
          <div className="absolute top-10 right-0 w-64 bg-white rounded-xl shadow-lg border p-4 z-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold">Accounts</h3>
              <button
                onClick={() => setToggleView(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Current User */}
            <div className="p-2 bg-violet-100 rounded-lg mb-2">
              <p className="font-medium text-sm">{currentUser?.email}</p>
              <span className="text-xs text-gray-500">Current</span>
            </div>

            {/* Other Accounts */}
            <div className="space-y-2">
              {accounts?.filter((acc) => acc.id !== currentUser?.id)
                .map((acc) => (
                  <div
                    key={acc.id}
                    className="flex justify-between items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <span
                      onClick={() => {
                        dispatch(switchAccount(acc.id));
                        setToggleView(false);
                      }}
                    >
                      {acc.email}
                    </span>
                    <button
                      onClick={() => dispatch(logoutAccount(acc.id))}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>

            {/* Add Account Button */}
            <button
              onClick={() => navigate("/login", { state: { fromAddAccount: true } })}
              className="mt-3 w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm"
            >
              Add Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
