const nemo = (
  io,
  data,
  conId,
  conDivision,
  conPosition,
  conType,
  conApp,
  event
) => {
  if (data.tipe == "notif") {
    var untuk = null;
    if (data.kategori == "app") {
      untuk = conApp[event];
    } else if (data.kategori == "type") {
      untuk = conApp[event] + " " + conType[data.type];
    } else if (data.kategori == "division") {
      untuk =
        conApp[event] +
        " " +
        conType[data.type] +
        " " +
        conDivision[data.division];
    } else if (data.kategori == "position") {
      untuk =
        conApp[event] +
        " " +
        conType[data.type] +
        " " +
        conDivision[data.division] +
        " " +
        conPosition[data.position];
    } else {
      untuk = conId[data.untuk];
    }
    if (untuk) {
      io.to(untuk).emit(data.event, data);
    }
  } else if (data.tipe == "reload") {
    io.emit(data.event);
  }
};

export default nemo;
