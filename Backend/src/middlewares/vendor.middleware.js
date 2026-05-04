
export const vendorApproved = (req, res, next) => {
  // Must be vendor
  if (req.user.role !== "vendor") {
    return res.status(403).json({
      message: "Only vendor allowed",
    });
  }

  // ✅ SUPPORT BOTH (old + new)
  const isApproved =
    req.user.store?.status === "approved" || req.user.isApproved;

  if (!isApproved) {
    return res.status(403).json({
      message: "Vendor not approved yet",
    });
  }

  // Must be active
  if (!req.user.isActive) {
    return res.status(403).json({
      message: "Vendor account is inactive",
    });
  }

  next();
};