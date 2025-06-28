import { Lock, Shield, Eye, Key, Fingerprint, Send } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import DecryptedText from './ui/DecryptedText';

const Security = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-20 blur-3xl"></div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative">
              <div className="w-full lg:w-1/2 text-center lg:text-left relative z-10">
                <span className="inline-block px-3 py-1.5 rounded-full bg-[#eef0ff] dark:bg-[#2d2f6b] text-[#5e63f9] font-medium text-xs sm:text-sm mb-4">
                  Military-Grade Security
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6 text-foreground">
                  Advanced Cryptography
                </h2>
                <p className="text-muted-foreground mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg max-w-lg mx-auto lg:mx-0">
                  Enterprise-grade security with zero-knowledge authentication
                  and end-to-end encryption.
                </p>

                {/* Compact Security Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-6 lg:mb-8">
                  <div className="flex items-center p-3 bg-background/50 dark:bg-card/50 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] rounded-lg mr-3">
                      <Eye className="h-4 w-4 text-[#5e63f9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        Zero-Knowledge Auth
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        OPAQUE protocol
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-background/50 dark:bg-card/50 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] rounded-lg mr-3">
                      <Key className="h-4 w-4 text-[#5e63f9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        ECDH P-256
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Perfect forward secrecy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-background/50 dark:bg-card/50 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] rounded-lg mr-3">
                      <Fingerprint className="h-4 w-4 text-[#5e63f9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        Ed25519 Signatures
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Message verification
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-background/50 dark:bg-card/50 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] rounded-lg mr-3">
                      <Shield className="h-4 w-4 text-[#5e63f9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        AES-256-GCM
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Authenticated encryption
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compact Specs */}
                <div className="bg-gradient-to-r from-[#f8f9ff] to-[#f0f2ff] dark:from-[#1a1b2e] dark:to-[#1e1f3a] rounded-xl p-4 mb-6 lg:mb-8 border border-[#e0e3ff] dark:border-[#2d2f6b]">
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="text-center">
                      <div className="font-mono text-[#5e63f9] font-bold">
                        256-bit
                      </div>
                      <span className="text-muted-foreground">Encryption</span>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[#5e63f9] font-bold">
                        Ed25519
                      </div>
                      <span className="text-muted-foreground">Signatures</span>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[#5e63f9] font-bold">
                        P-256
                      </div>
                      <span className="text-muted-foreground">ECDH</span>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[#5e63f9] font-bold">
                        OPAQUE
                      </div>
                      <span className="text-muted-foreground">Zero-KN</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white font-medium px-6 py-3 text-sm sm:text-base rounded-full shadow-lg transition-all cursor-pointer w-full sm:w-auto"
                  onClick={() => navigate('/signup')}
                >
                  Try Secure Messaging
                </Button>
              </div>

              {/* Enhanced Mobile Visualization */}
              <div className="w-full lg:w-1/2 flex justify-center relative z-10 mt-8 lg:mt-0">
                <div className="relative">
                  {/* Responsive Phone Frame */}
                  <div className="relative w-[240px] sm:w-[280px] h-[480px] sm:h-[560px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[45px] sm:rounded-[54px] p-1.5 shadow-2xl border-[3px] sm:border-[3.5px] border-gray-800 z-10">
                    {/* Notch */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1/3 h-5 sm:h-6 bg-gray-900 rounded-xl z-20"></div>

                    {/* Screen content */}
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[40px] sm:rounded-[48px] overflow-hidden relative z-10">
                      {/* Header with security indicator */}
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 sm:p-3 pt-8 sm:pt-9   pb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] flex items-center justify-center">
                            <span className="text-[#5e63f9] font-bold text-xs">
                              JA
                            </span>
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <p className="font-medium dark:text-gray-100 text-xs sm:text-sm">
                              Jibber Admin
                            </p>
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mr-1"></div>
                              <span className="text-[10px] text-green-600 dark:text-green-400">
                                E2E Encrypted
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-[#5e63f9]" />
                          <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-[#5e63f9]" />
                        </div>
                      </div>

                      {/* Messages with crypto indicators */}
                      <div className="p-3 sm:p-5 h-[340px] sm:h-[380px] overflow-y-auto flex flex-col space-y-3 sm:space-y-5 text-xs sm:text-sm">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tl-sm max-w-[85%] self-start dark:text-gray-200 shadow-sm">
                          <DecryptedText text={"Hello, how are you?"} animateOn="view" speed={50} revealDirection="center" />
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <p className="text-[9px] sm:text-[10px] text-gray-400">
                              10:30 AM
                            </p>
                            <div className="flex items-center space-x-1">
                              <div className="w-1 h-1 rounded-full bg-green-500"></div>
                              <span className="text-[8px] sm:text-[9px] text-green-600">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#5e63f9] p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tr-sm max-w-[85%] self-end text-white shadow-sm">
                          <DecryptedText text={"I'm good, thanks!"} animateOn="view" speed={50} revealDirection="center" />
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <p className="text-[9px] sm:text-[10px] text-[#e0e1ff]">
                              10:32 AM
                            </p>
                            <div className="flex items-center space-x-1">
                              <Fingerprint className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-[#e0e1ff]" />
                              <span className="text-[8px] sm:text-[9px] text-[#e0e1ff]">
                                Signed
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tl-sm max-w-[85%] self-start dark:text-gray-200 shadow-sm">
                          <DecryptedText text={"Encryption working perfectly!"} animateOn="view" speed={50} revealDirection="center" />
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <p className="text-[9px] sm:text-[10px] text-gray-400">
                              10:33 AM
                            </p>
                            <div className="flex items-center space-x-1">
                              <Key className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-green-600" />
                              <span className="text-[8px] sm:text-[9px] text-green-600">
                                ECDH
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 sm:p-3 px-3 sm:px-4">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full flex items-center p-1 sm:p-1.5 pl-3 sm:pl-5 pr-1 sm:pr-2 border border-[#5e63f9]/20">
                          <input
                            type="text"
                            placeholder=""
                            className="bg-transparent outline-none w-full flex-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                            readOnly
                          />

                          <button className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] h-7 w-7 sm:h-9 sm:w-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-200">
                            <Send className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced reflection effect */}
                  <div className="absolute inset-0 rounded-[45px] sm:rounded-[54px] bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-20 pointer-events-none"></div>
                </div>
              </div>
            </div>
    </>
  )
}

export default Security