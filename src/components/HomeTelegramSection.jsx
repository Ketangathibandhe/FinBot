import React from "react";
import { Send, FileText, PieChart } from "lucide-react";
import telegramImg from "../assets/telegram.png";

const HomeTelegramSection = () => {
  return (
    <section className="relative  py-16 mx-auto my-8 overflow-hidden rounded-3xl shadow-2xl ml-3 mr-3">
      <div className="absolute inset-0 bg-linear-to-r from-blue-200 to-purple-300"></div>

      {/* Grid*/}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), 
                            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "40px 40px", // Grid box size
        }}
      ></div>

      {/*Content Layer*/}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-y-8 md:gap-x-12">
          {/*Text Content */}
          <div className="w-full lg:pl-10 md:w-1/2 flex flex-col justify-center">
            <div className="space-y-2 mb-6 md:mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Manage Your Finances <br />
                <span className="text-purple-600">Right from Telegram</span>
              </h2>
            </div>

            {/* Mobile Image */}
            <div className="md:hidden w-full flex justify-center relative mb-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-white rounded-full blur-3xl opacity-40 -z-10"></div>
              <img
                src={telegramImg}
                alt="FinBot Telegram Interface Mobile"
                className="w-full max-w-[280px] drop-shadow-2xl animate-float"
              />
            </div>

            <div className="space-y-6">
              <p className="text-lg text-gray-700 max-w-lg font-medium">
                No complex apps, no clutter. Just chat with FinBot like a
                friend, and we'll track everything for you.
              </p>

              {/* Feature List */}
              <div className="space-y-4 mt-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*RIGHT SIDE (Desktop Image)*/}
          <div className="hidden md:flex w-full md:w-1/2 justify-center md:justify-start md:pl-10 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white rounded-full blur-3xl opacity-50 -z-10"></div>

            <img
              src={telegramImg}
              alt="FinBot Telegram Interface Desktop"
              className="w-full max-w-xs md:max-w-sm drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: <Send size={18} />,
    title: "Natural Language Logging",
    description: "Just text '200 petrol' or '500 lunch'. FinBot understands.",
  },
  {
    icon: <PieChart size={18} />,
    title: "Smart Categorization",
    description: "AI automatically detects categories like Transport or Food.",
  },
  {
    icon: <FileText size={18} />,
    title: "Instant PDF Reports",
    description: "Get monthly summaries via simple /report command.",
  },
];

export default HomeTelegramSection;
