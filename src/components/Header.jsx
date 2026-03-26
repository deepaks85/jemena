const Header = () => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <input className="form-control w-50" placeholder="Search all ID" />

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-primary">Create new</button>

        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="rounded-circle"
        />
      </div>
    </div>
  );
};

export default Header;
