import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Linkedin,
  Github,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const RendererFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Security", href: "#security" },
        { name: "Integrations", href: "#integrations" },
        { name: "API Documentation", href: "#api" },
        { name: "Mobile Apps", href: "#mobile" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Blog", href: "#blog" },
        { name: "Careers", href: "#careers" },
        { name: "Press Kit", href: "#press" },
        { name: "Contact", href: "#contact" },
        { name: "Partners", href: "#partners" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Community", href: "#community" },
        { name: "Status Page", href: "#status" },
        { name: "Bug Reports", href: "#bugs" },
        { name: "Feature Requests", href: "#features" },
        { name: "System Requirements", href: "#requirements" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#twitter" },
    { name: "Facebook", icon: Facebook, href: "#facebook" },
    { name: "LinkedIn", icon: Linkedin, href: "#linkedin" },
    { name: "GitHub", icon: Github, href: "#github" },
  ];

  const currentLocation = useLocation().pathname;

  return (
    <>
      {currentLocation === "/register" || currentLocation === "/login" ? (
        // register & login footer
        <footer
          className={` ${
            currentLocation === "/login" && "-mt-14"
          }bg-blue-50/30 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                MailFlow
              </span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-800 mb-2">
                © {currentYear} MailFlow. All Rights Reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-700">
                <a
                  href="#privacy"
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#security"
                  className="hover:text-blue-600 transition-colors"
                >
                  Security
                </a>
              </div>
            </div>
          </div>
        </footer>
      ) : (
        <footer className="bg-blue-50/30 text-gray-800">
          <div className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    MailFlow
                  </span>
                </div>
                <p className="text-gray-700 mb-6 max-w-md leading-relaxed">
                  The professional email platform trusted by thousands of
                  businesses worldwide. Secure, fast, and intelligent email
                  management for modern teams.
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>hello@mailflow.com</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>123 Tech Street, San Francisco, CA 94105</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 group"
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer Links */}
              <div className="lg:col-span-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {footerSections.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <a
                              href={link.href}
                              className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
                            >
                              {link.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-300 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
              <p className="text-gray-700 text-sm mb-4 lg:mb-0">
                © {currentYear} MailFlow. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-end gap-6">
                <a
                  href="#privacy"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="#cookies"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
                >
                  Cookie Policy
                </a>
                <a
                  href="#gdpr"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
                >
                  GDPR Compliance
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default RendererFooter;
